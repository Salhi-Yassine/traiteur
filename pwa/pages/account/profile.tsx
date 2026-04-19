import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { Settings, ChevronLeft, CheckCircle2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";
import apiClient, { ApiError } from "../../utils/apiClient";
import { Button } from "../../components/ui/button";
import { FloatingInput } from "../../components/ui/floating-input";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

function Avatar({ name }: { name: string }) {
    const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    return (
        <div className="w-20 h-20 rounded-full bg-primary/10 text-primary font-bold text-[28px] flex items-center justify-center select-none">
            {initials}
        </div>
    );
}

export default function AccountProfilePage() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { user, isLoading: authLoading, logout, refreshUser } = useAuth();
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [serverError, setServerError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) void router.replace("/auth/login?next=/account/profile");
    }, [user, authLoading, router]);

    const schema = z.object({
        firstName: z.string().min(1, t("auth.first_name_req")),
        lastName:  z.string().min(1, t("auth.last_name_req")),
        phone:     z.string().optional(),
    });
    type FormValues = z.infer<typeof schema>;

    const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: user?.firstName ?? "",
            lastName:  user?.lastName  ?? "",
            phone:     "",
        },
    });

    // Sync form when user loads
    useEffect(() => {
        if (user) reset({ firstName: user.firstName, lastName: user.lastName, phone: "" });
    }, [user, reset]);

    const onSubmit = async (values: FormValues) => {
        setSaveStatus("saving");
        setServerError(null);
        try {
            await apiClient.patch(`/api/users/${user!.id}`, {
                firstName: values.firstName,
                lastName:  values.lastName,
                ...(values.phone && { phone: values.phone }),
            });
            await refreshUser();
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch (err) {
            const msg = err instanceof ApiError ? err.message : t("account.save_error");
            setServerError(msg);
            setSaveStatus("error");
        }
    };

    const backHref = user?.userType === "couple" ? "/mariage" : user?.userType === "vendor" ? "/dashboard/vendor" : "/";
    const backLabel = user?.userType === "couple" ? t("account.nav_back_couple") : t("account.nav_back_vendor");

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{t("account.title")} — Farah.ma</title>
            </Head>
            <Navbar />

            <div className="min-h-screen bg-neutral-50 py-10">
                <div className="max-w-2xl mx-auto px-4 sm:px-6">
                    <Link href={backHref} className="inline-flex items-center gap-1.5 text-[14px] text-neutral-500 hover:text-neutral-900 transition-colors mb-6 group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform rtl:rotate-180" />
                        {backLabel}
                    </Link>

                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <Settings className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-[22px] font-bold text-neutral-900">{t("account.title")}</h1>
                            <p className="text-[13px] text-neutral-500">{t("account.subtitle")}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                            <div className="flex items-center gap-5 mb-6">
                                <Avatar name={`${user.firstName} ${user.lastName}`} />
                                <div>
                                    <p className="text-[18px] font-bold text-neutral-900">{user.firstName} {user.lastName}</p>
                                    <p className="text-[13px] text-neutral-500 mt-0.5 capitalize">{user.userType}</p>
                                </div>
                            </div>

                            <h2 className="text-[14px] font-bold text-neutral-700 mb-4 uppercase tracking-wider">
                                {t("account.personal_info")}
                            </h2>

                            {serverError && (
                                <div className="mb-4 p-3.5 bg-[#FEECEC] border border-[#C13030]/20 rounded-xl text-[13px] text-[#C13030]">
                                    {serverError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <FloatingInput
                                        id="firstName"
                                        label={t("account.first_name")}
                                        type="text"
                                        autoComplete="given-name"
                                        {...register("firstName")}
                                        error={errors.firstName?.message}
                                    />
                                    <FloatingInput
                                        id="lastName"
                                        label={t("account.last_name")}
                                        type="text"
                                        autoComplete="family-name"
                                        {...register("lastName")}
                                        error={errors.lastName?.message}
                                    />
                                </div>
                                <FloatingInput
                                    id="phone"
                                    label={t("account.phone")}
                                    type="tel"
                                    autoComplete="tel"
                                    placeholder="+212 6XX XXX XXX"
                                    {...register("phone")}
                                />

                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !isDirty}
                                    loading={saveStatus === "saving"}
                                    className={cn(
                                        "h-[48px] px-8 text-[14px] font-semibold rounded-xl transition-all",
                                        saveStatus === "saved" && "bg-green-600 hover:bg-green-600",
                                    )}
                                >
                                    {saveStatus === "saved" ? (
                                        <span className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            {t("account.saved")}
                                        </span>
                                    ) : saveStatus === "saving" ? (
                                        t("account.saving")
                                    ) : (
                                        t("account.save")
                                    )}
                                </Button>
                            </form>
                        </div>

                        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                            <h2 className="text-[14px] font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                                {t("account.email_section")}
                            </h2>
                            <p className="text-[13px] text-neutral-500 mb-3">{t("account.email_hint")}</p>
                            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                                <span className="text-[14px] font-medium text-neutral-800">{user.email}</span>
                            </div>
                        </div>

                        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                            <h2 className="text-[14px] font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                                {t("account.password_section")}
                            </h2>
                            <p className="text-[13px] text-neutral-500 mb-4">••••••••</p>
                            <Link href="/auth/forgot-password">
                                <Button variant="outline" className="h-[44px] rounded-xl text-[14px]">
                                    {t("account.change_password")}
                                </Button>
                            </Link>
                        </div>

                        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                            <h2 className="text-[14px] font-bold text-neutral-700 mb-4 uppercase tracking-wider">
                                {t("account.danger_zone")}
                            </h2>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={logout}
                                className="h-[44px] rounded-xl text-[14px] text-[#C13030] border-[#C13030]/30 hover:bg-[#FEECEC] hover:border-[#C13030]"
                            >
                                <LogOut className="w-4 h-4 me-2" />
                                {t("account.logout")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || "fr", ["common"])),
    },
});
