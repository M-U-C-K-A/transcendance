'use client';

import { Login } from "@/components/auth/Login";
import { Register } from "@/components/auth/Register";
import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/setting/theme-toggle";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n-client";

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const t = useI18n();

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            {t('app.title')} {/* Assuming you have this translation key */}
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {isLogin ? <Login /> : <Register />}
            <div className="mt-4 text-center text-sm">
              {isLogin ? (
                <>
                  {t('auth.noAccount')}{" "}
                  <Button
                    variant="link"
                    onClick={() => setIsLogin(false)}
                    className="h-auto p-0"
                  >
                    {t('auth.registertext')}
                  </Button>
                </>
              ) : (
                <>
                  {t('auth.haveAccount')}{" "}
                  <Button
                    variant="link"
                    onClick={() => setIsLogin(true)}
                    className="h-auto p-0"
                  >
                    {t('auth.logintext')}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          width={661}
          height={882}
          src="/school.jpeg"
          alt={t('auth.loginImageAlt')}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
      </div>
    </div>
  );
}
