import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useLoaderStore } from "@/store/loaderStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useAuth = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const { hideLoader, showLoader } = useLoaderStore();

  const login = async (email: string, password: string) => {
    try {
      showLoader();
      const res = await api.post("auth/login", {
        email,
        password,
      });

      setUser(res?.data?.user);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid credentials!");
      console.log(error);
    } finally {
      hideLoader();
    }
  };

  const register = async (
    fullName: string,
    companyId: string,
    email: string,
    password: string
  ) => {
    try {
      showLoader();
      const res = await api.post("auth/register", {
        fullName,
        company: companyId,
        email,
        password,
      });

      setUser(res.data.user);
      toast.success("Registered successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Signup failed");
      console.error(error);
    } finally {
      hideLoader();
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      clearUser();
      toast.success("Logout successful");
      navigate("/");
    } catch (error) {
      console.log(`Logout Failed: ${error}`);
    }
  };

  return { login, register, logout };
};
