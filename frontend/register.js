const registerBtn = document.querySelector("#registerBtn");

registerBtn.addEventListener("click", async () => {

    const username = document.querySelector("#username").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;

    if (!username || !email || !password) {
        alert("Please fill all fields.");
        return;
    }

    try {
        const response = await fetch(
            `${window.APP_CONFIG.API_URL}/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Registration failed");
        }

        alert(data.message);
        window.location.href = "login.html";

    } catch (error) {
        console.error("Registration Error:", error);
        alert("Registration failed. Please try again.");
    }
});
