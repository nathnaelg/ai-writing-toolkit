import openai

# Set your API key here
openai.api_key = "YOUR_OPENAI_API_KEY"

def ai_prompt(task, input_text):
    system_prompt = f"You are an expert writing assistant. Your job is to {task}."

    response = openai.ChatCompletion.create(
        model="gpt-4",  # or "gpt-3.5-turbo"
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": input_text}
        ],
        temperature=0.7,
        max_tokens=1000
    )
    return response['choices'][0]['message']['content'].strip()

def menu():
    print("\n🧠 AI Writing Toolkit")
    print("1. Generate Ideas")
    print("2. Expand Content")
    print("3. Summarize Text")
    print("4. Rephrase / Rewrite")
    print("5. Grammar Check")
    print("6. Exit")

def main():
    while True:
        menu()
        choice = input("\nSelect an option (1-6): ")

        if choice == '6':
            print("Exiting... Goodbye!")
            break

        input_text = input("\nEnter your text or topic:\n")

        if choice == '1':
            task = "generate writing ideas based on the following topic"
        elif choice == '2':
            task = "expand the following content to be more detailed and engaging"
        elif choice == '3':
            task = "summarize the following text"
        elif choice == '4':
            task = "rephrase the following text in a clearer and more elegant way"
        elif choice == '5':
            task = "check and correct grammar, spelling, and punctuation"
        else:
            print("Invalid choice. Try again.")
            continue

        output = ai_prompt(task, input_text)
        print("\n✍️ Result:\n")
        print(output)

if __name__ == "__main__":
    main()