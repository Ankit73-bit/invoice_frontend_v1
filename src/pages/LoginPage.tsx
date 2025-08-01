import { LoginForm } from "@/features/authentication/LoginForm";
import { ModeToggle } from "@/features/components/ModeToggle";
import { GalleryVerticalEnd, CheckCircle, Zap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/80" />

      <div className="relative flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-16">
            <a href="#" className="flex items-center gap-3 font-bold text-xl">
              <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl shadow-lg">
                <GalleryVerticalEnd className="size-6" />
              </div>
              Paras Invoice
            </a>
            <ModeToggle />
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Marketing Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  <Zap className="size-4" />
                  Professional Invoicing Made Simple
                </div>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Create Beautiful{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Invoices
                  </span>{" "}
                  in Minutes
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed">
                  Streamline your billing process with our intuitive invoice
                  generator. Professional templates, automated calculations, and
                  seamless client management.
                </p>
              </div>

              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="size-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    Professional Templates
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="size-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    Automated Calculations
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="size-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium">Client Management</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="size-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium">PDF Export</span>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                  <div className="space-y-6">
                    <LoginForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
