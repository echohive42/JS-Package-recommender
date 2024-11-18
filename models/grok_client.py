from groq import Groq
from termcolor import colored
import json
import os
import re

MODEL = "llama-3.2-11b-text-preview"
class GrokClient:
    def __init__(self):
        try:
            self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
            print(colored("Grok client initialized successfully", "green"))
        except Exception as e:
            print(colored(f"Error initializing Grok client: {str(e)}", "red"))
            raise

    async def get_library_recommendations(self, user_input: str):
        try:
            print(colored("Sending request to Grok API...", "cyan"))
            
            system_prompt = """
            You are a JavaScript library recommendation assistant. Analyze the user's project description 
            and provide recommendations in the following format:
            <recommendations>
            library: library_name
            description: 3-4 sentence description of what the library does and its key features
            ---
            library: another_library
            description: brief description of this library
            </recommendations>

            Keep descriptions concise but informative, focusing on main features and use cases.
            Include 3-5 most relevant libraries for the project.
            """

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_input}
                ],
                model=MODEL
            )

            content = chat_completion.choices[0].message.content
            print(colored("Received response from Grok", "green"))

            # Extract library recommendations using regex
            recommendations_match = re.search(r'<recommendations>(.*?)</recommendations>', content, re.DOTALL)
            if not recommendations_match:
                raise ValueError("Invalid response format from model")

            # Parse the recommendations
            recommendations_text = recommendations_match.group(1).strip()
            library_blocks = recommendations_text.split('---')
            
            libraries = []
            for block in library_blocks:
                lib_match = re.search(r'library:\s*(.*?)\n', block)
                desc_match = re.search(r'description:\s*(.*?)(?:\n|$)', block, re.DOTALL)
                
                if lib_match and desc_match:
                    lib_name = lib_match.group(1).strip()
                    description = desc_match.group(1).strip()
                    libraries.append({
                        "name": lib_name,
                        "description": description,
                        "category": "JavaScript",
                        "url": f"https://www.npmjs.com/package/{lib_name.lower().replace('.js', '')}"
                    })
            
            response = {"libraries": libraries}
            
            print(colored(f"Successfully parsed {len(libraries)} package recommendations", "green"))
            return response
            
        except Exception as e:
            print(colored(f"Error getting library recommendations: {str(e)}", "red"))
            raise