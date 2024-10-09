import { createElement as h, useState, useEffect } from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom/client";

function useLoginForm() {
    const [values, setValues] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState({ username: "", password: "" });
    const [touched, setTouched] = useState({ username: false, password: false });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const isFormValid = Object.values(errors).every((value) => value === "");

    function validateForm(values) {
        const newErrors = { ...errors }
        for (const inputName in values) {
            if (values[inputName] === "") {
                newErrors[inputName] = "This field is required"
            } else {
                newErrors[inputName] = ""
            }
        }
        setErrors(newErrors);
    }

    function handleChange(event) {
        const newValues = { ...values, [event.target.name]: event.target.value }
        setValues(newValues);
        validateForm(newValues)
    }

    function handleBlur(event) {
        setTouched({ ...touched, [event.target.name]: true });
    }

    function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        setIsSubmitted(false);

        // Simulate 2 seconds of loading after submission, then stop "loading"
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 2000);
    }

    useEffect(() => {
        validateForm(values)
    }, [])

    console.log(errors)

    return {
        values,
        errors,
        touched,
        isLoading,
        isSubmitted,
        isFormValid,
        handleChange,
        handleBlur,
        handleSubmit,
    };
}

function LoginForm() {
    const form = useLoginForm();

    return h("form", { onSubmit: form.handleSubmit },
        h("div", null,
            h("label", null,
                "Username",
                h("input", {
                    name: "username",
                    value: form.values.username,
                    disabled: form.isLoading,
                    onChange: form.handleChange,
                    onBlur: form.handleBlur
                }),
            ),

            // Only display error if field was modified and is currently invalid
            (form.touched.username && !!form.errors.username)
                ? h("p", null, form.errors.username)
                : null
        ),

        h("div", null,
            h("label", null,
                "Password",
                h("input", {
                    name: "password",
                    value: form.values.password,
                    disabled: form.isLoading,
                    onChange: form.handleChange,
                    onBlur: form.handleBlur
                }),
            ),

            // Only display error if field was modified and is currently invalid
            (form.touched.password && !!form.errors.password)
                ? h("p", null, form.errors.password)
                : null
        ),

        h("div", null,
            // Don't allow submission until all fields are valid
            h("button", { type: "submit", disabled: !form.isFormValid || form.isLoading },
                "Submit"
            )
        ),

        form.isLoading
            ? h("p", null, "Processing request...")
            : form.isSubmitted
                ? h("p", null, "You are now logged in!")
                : null
    )
}

function App() {
    return h("div", null,
        h("h1", null, "Login"),
        h(LoginForm)
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(h(App));
