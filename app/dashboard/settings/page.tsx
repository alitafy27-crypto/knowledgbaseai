"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  CreditCard,
  Lock,
  Save,
  Shield,
  User,
  Camera,
  Building2,
  Mail,
  Sparkles,
} from "lucide-react";

type SettingsTab = "profile" | "notifications" | "security" | "billing";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const [fullName, setFullName] = useState("knowledgbaseai User");
  const [company, setCompany] = useState("My Company");
  const [email, setEmail] = useState("you@example.com");

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-gray-50/50 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-600">
            <Sparkles className="h-4 w-4" />
            Workspace Settings
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-slate-900">
            Settings
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Manage your account, notifications, security and subscription preferences.
          </p>
        </div>

        {/* Main Settings Layout */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* Settings Navigation */}
          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="mb-3 px-3 pt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
              Account
            </div>

            <SettingsNavItem
              icon={User}
              title="Profile"
              description="Personal information"
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />

            <SettingsNavItem
              icon={Bell}
              title="Notifications"
              description="Email and alerts"
              active={activeTab === "notifications"}
              onClick={() => setActiveTab("notifications")}
            />

            <SettingsNavItem
              icon={Shield}
              title="Security"
              description="Password and protection"
              active={activeTab === "security"}
              onClick={() => setActiveTab("security")}
            />

            <SettingsNavItem
              icon={CreditCard}
              title="Billing"
              description="Plan and payments"
              active={activeTab === "billing"}
              onClick={() => setActiveTab("billing")}
            />

            {/* Workspace Card */}
            <div className="mt-5 border-t border-gray-200 pt-5">
              <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-bold text-white">
                    A
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-900">
                      Personal Workspace
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Free Plan
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Storage</span>
                  <span className="text-slate-600">0.8 / 5 GB</span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[16%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
                </div>

                <button
                  type="button"
                  className="mt-4 w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-violet-100 hover:text-violet-700"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <section className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {activeTab === "profile" && (
              <ProfileSettings
                fullName={fullName}
                company={company}
                email={email}
                setFullName={setFullName}
                setCompany={setCompany}
                setEmail={setEmail}
                onSave={handleSave}
                saved={saved}
              />
            )}

            {activeTab === "notifications" && <NotificationsSettings />}

            {activeTab === "security" && <SecuritySettings />}

            {activeTab === "billing" && <BillingSettings />}
          </section>
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Settings Navigation                                                        */
/* -------------------------------------------------------------------------- */

function SettingsNavItem({
  icon: Icon,
  title,
  description,
  active,
  onClick,
}: {
  icon: typeof User;
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-1 flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
        active
          ? "bg-violet-50 text-violet-700"
          : "text-slate-500 hover:bg-gray-50 hover:text-slate-900"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          active
            ? "bg-violet-100 text-violet-600"
            : "bg-gray-100 text-slate-500"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold">{title}</p>
        <p className="mt-0.5 truncate text-[10px] text-slate-500">
          {description}
        </p>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Profile                                                                    */
/* -------------------------------------------------------------------------- */

function ProfileSettings({
  fullName,
  company,
  email,
  setFullName,
  setCompany,
  setEmail,
  onSave,
  saved,
}: {
  fullName: string;
  company: string;
  email: string;
  setFullName: (value: string) => void;
  setCompany: (value: string) => void;
  setEmail: (value: string) => void;
  onSave: () => void;
  saved: boolean;
}) {
  return (
    <>
      <div className="border-b border-gray-200 px-6 py-6 md:px-8">
        <h2 className="text-xl font-bold text-slate-900">
          Profile Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Update your personal and workspace information.
        </p>
      </div>

      <div className="p-6 md:p-8">
        {/* Avatar */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-2xl font-bold text-white shadow-md shadow-violet-500/10">
              A
            </div>

            <button
              type="button"
              aria-label="Change avatar"
              className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-violet-600 text-white shadow-lg transition hover:bg-violet-500"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Profile Picture
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              JPG, PNG or WEBP. Maximum 2MB.
            </p>

            <button
              type="button"
              className="mt-3 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
            >
              Change Avatar
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <InputField
            label="Full Name"
            icon={User}
            value={fullName}
            onChange={setFullName}
          />

          <InputField
            label="Company"
            icon={Building2}
            value={company}
            onChange={setCompany}
          />

          <div className="md:col-span-2">
            <InputField
              label="Email Address"
              icon={Mail}
              type="email"
              value={email}
              onChange={setEmail}
            />
          </div>
        </div>

        {/* Workspace */}
        <div className="my-8 border-t border-gray-200 pt-7">
          <h3 className="text-sm font-semibold text-slate-900">Workspace</h3>

          <p className="mt-1 text-xs text-slate-500">
            Configure your default AI workspace.
          </p>

          <div className="mt-5 flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <User className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Personal Workspace
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Your default knowledge and AI environment.
              </p>
            </div>

            <div className="ml-auto">
              <Check className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-xs font-bold text-white shadow-md shadow-violet-600/10 transition hover:scale-[1.01]"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>

          {saved && (
            <span className="flex items-center gap-2 text-xs font-medium text-emerald-600">
              <Check className="h-4 w-4" />
              Changes saved
            </span>
          )}
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Input                                                                      */
/* -------------------------------------------------------------------------- */

function InputField({
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  icon: typeof User;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-slate-700">
        {label}
      </span>

      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
        />
      </div>
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/* Notifications                                                             */
/* -------------------------------------------------------------------------- */

function NotificationsSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [documentUpdates, setDocumentUpdates] = useState(true);
  const [aiActivity, setAiActivity] = useState(false);

  return (
    <SettingsPanel
      title="Notifications"
      description="Control how knowledgbaseai keeps you informed."
    >
      <ToggleRow
        title="Email Notifications"
        description="Receive important workspace updates by email."
        enabled={emailNotifications}
        onChange={setEmailNotifications}
      />

      <ToggleRow
        title="Document Updates"
        description="Get notified when documents finish indexing."
        enabled={documentUpdates}
        onChange={setDocumentUpdates}
      />

      <ToggleRow
        title="AI Activity"
        description="Receive periodic summaries about AI assistant usage."
        enabled={aiActivity}
        onChange={setAiActivity}
      />
    </SettingsPanel>
  );
}

/* -------------------------------------------------------------------------- */
/* Security                                                                   */
/* -------------------------------------------------------------------------- */

function SecuritySettings() {
  return (
    <SettingsPanel
      title="Security"
      description="Protect your account and workspace."
    >
      <div className="space-y-5">
        <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Lock className="h-4 w-4" />
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900">
              Password
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Your password was last updated recently.
            </p>

            <button
              type="button"
              className="mt-4 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
            >
              Change Password
            </button>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <Shield className="h-4 w-4" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Two-Factor Authentication
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Add an additional layer of protection to your account.
            </p>

            <button
              type="button"
              className="mt-4 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-violet-500/20"
            >
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
    </SettingsPanel>
  );
}

/* -------------------------------------------------------------------------- */
/* Billing                                                                    */
/* -------------------------------------------------------------------------- */

function BillingSettings() {
  return (
    <SettingsPanel
      title="Billing & Subscription"
      description="Manage your knowledgbaseai plan and payments."
    >
      <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-cyan-50 p-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
              Current Plan
            </p>

            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              Free
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              5 GB storage · Basic AI features
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-xs font-bold text-white shadow-md shadow-violet-500/20 transition hover:scale-[1.01]"
          >
            Upgrade Plan
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-slate-600">
            <CreditCard className="h-4 w-4" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Payment Methods
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              No payment method has been added.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="mt-5 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
        >
          Add Payment Method
        </button>
      </div>
    </SettingsPanel>
  );
}

/* -------------------------------------------------------------------------- */
/* Generic Panel                                                              */
/* -------------------------------------------------------------------------- */

function SettingsPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="border-b border-gray-200 px-6 py-6 md:px-8">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <div className="p-6 md:p-8">{children}</div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Toggle                                                                     */
/* -------------------------------------------------------------------------- */

function ToggleRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-gray-200 py-5 last:border-b-0">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        aria-label={`Toggle ${title}`}
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-violet-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}