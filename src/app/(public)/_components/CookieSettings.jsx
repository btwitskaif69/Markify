import { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SEO from "@/components/SEO/SEO";
import { buildBreadcrumbSchema, getCanonicalUrl } from "@/lib/seo";

const CookieSettings = () => {
    const [settings, setSettings] = useState({
        essential: true,
        analytics: false,
        marketing: false,
    });
    const breadcrumbs = buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Cookie Settings", path: "/cookie-settings" },
    ]);

    useEffect(() => {
        const savedSettings = localStorage.getItem('cookieSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handleToggle = (key) => {
        if (key === 'essential') return; // Essential cookies cannot be disabled
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        localStorage.setItem('cookieSettings', JSON.stringify(settings));
        toast.success("Cookie preferences saved.");
    };

    return (
        <div className="min-h-screen bg-background pt-20 pb-10 px-4 sm:px-6 lg:px-8">
            <SEO
                title="Manage Cookie Settings"
                description="Update cookie preferences for the Markify bookmark manager, including analytics and marketing choices."
                canonical={getCanonicalUrl("/cookie-settings")}
                structuredData={breadcrumbs ? [breadcrumbs] : null}
            />
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-4 text-foreground">Cookie Settings</h1>
                <p className="text-muted-foreground mb-8">
                    Manage your cookie preferences. Essential cookies are necessary for the website to function properly and cannot be disabled.
                </p>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                        <div>
                            <h3 className="font-semibold text-lg">Essential Cookies</h3>
                            <p className="text-sm text-muted-foreground">Required for basic site functionality.</p>
                        </div>
                        <Switch checked={settings.essential} disabled />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                        <div>
                            <h3 className="font-semibold text-lg">Analytics Cookies</h3>
                            <p className="text-sm text-muted-foreground">Help us improve our website by collecting anonymous usage data.</p>
                        </div>
                        <Switch
                            checked={settings.analytics}
                            onCheckedChange={() => handleToggle('analytics')}
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                        <div>
                            <h3 className="font-semibold text-lg">Marketing Cookies</h3>
                            <p className="text-sm text-muted-foreground">Used to deliver relevant advertisements and track ad performance.</p>
                        </div>
                        <Switch
                            checked={settings.marketing}
                            onCheckedChange={() => handleToggle('marketing')}
                        />
                    </div>

                    <div className="pt-4">
                        <Button onClick={handleSave} className="w-full sm:w-auto">
                            Save Preferences
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieSettings;
