import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/studentApi";
import { useToast } from "../components/Toast";

function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = isRegister
                ? await registerUser(form)
                : await loginUser({ email: form.email, password: form.password });
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
            toast.success(isRegister ? "Account created successfully!" : "Welcome back!");
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo"><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" /></svg></div>
                <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>
                    {isRegister ? "Create Account" : "Welcome back"}
                </h1>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
                    {isRegister ? "Register to manage enrollments" : "Sign in to EduEnroll"}
                </p>



                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {isRegister && (
                        <div>
                            <label className="label">Name</label>
                            <input name="name" value={form.name} onChange={handleChange} required className="input" placeholder="Your name" />
                        </div>
                    )}
                    <div>
                        <label className="label">Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} required className="input" placeholder="name@example.com" />
                    </div>
                    <div>
                        <label className="label">Password</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} required className="input" placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "10px", marginTop: "4px" }}>
                        {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
                    </button>
                </form>

                <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)", marginTop: "20px" }}>
                    {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontFamily: "inherit" }}
                    >
                        {isRegister ? "Sign in" : "Register"}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
