import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useLoaderStore } from "@/store/loaderStore";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showSignUp, setShowSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const { showLoader, hideLoader } = useLoaderStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (showSignUp) {
        showLoader();
        const res = await api.post("/auth/register", {
          fullName,
          companyName,
          email,
          password,
        });
        console.log(res);

        setUser(res?.data?.user);
        hideLoader();
        navigate("/dashboard");
      } else {
        showLoader();
        const res = await api.post("/auth/login", {
          email,
          password,
        });

        setUser(res?.data?.user);
        hideLoader();
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast("Wrong credentials!");
    } finally {
      hideLoader();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          {showSignUp ? "Create to your account" : "Login to your account"}
        </h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your creadentials below to login/signup to your account
        </p>
      </div>
      <div className="grid gap-6">
        {showSignUp && (
          <>
            <div className="grid gap-3">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Paras Print"
                onChange={(e) => setCompanyName(e.target.value)}
                value={companyName}
                required
              />
            </div>
          </>
        )}
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="paras@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <Button type="submit" className="w-full cursor-pointer">
          {showSignUp ? "Sign up" : "Login"}
        </Button>
      </div>
      <div className="text-center text-sm">
        {showSignUp ? "Already" : "Don't"} have an account?{" "}
        <a
          onClick={() => setShowSignUp((show) => !show)}
          className="underline underline-offset-4 cursor-pointer"
        >
          {showSignUp ? "Login" : "Sign up"}
        </a>
      </div>
    </form>
  );
}
