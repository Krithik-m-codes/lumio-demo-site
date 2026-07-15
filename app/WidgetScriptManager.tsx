"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "lumio.widget-script-config";
const SCRIPT_ID = "lumio-widget-script";

const DEFAULT_SNIPPET = `<script
    src="https://chat.shubpy.com/widget.js"
  data-workspace-key="7ea9573b-0055-4fcf-843d-3d9fcd97d6f3"
  data-modules='["chat", "bots", "kb", "callbacks", "rtc"]'
  async>
</script>`;

const SNIPPET_PRESETS = [
    {
        id: "custom",
        label: "Custom snippet",
        snippet: "",
    },
    {
        id: "shubpy-default",
        label: "Shubpy default snippet",
        snippet: DEFAULT_SNIPPET,
    },
];

function readStoredSnippet(): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        return null;
    }

    try {
        const parsed = JSON.parse(stored) as { snippet?: unknown };
        if (typeof parsed.snippet !== "string") {
            return null;
        }

        return parsed.snippet.trim();
    } catch {
        return null;
    }
}

function extractScriptElement(snippet: string) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = snippet.trim();
    return wrapper.querySelector("script");
}

export default function WidgetScriptManager() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasLoadedConfig, setHasLoadedConfig] = useState(false);
    const [activeSnippet, setActiveSnippet] = useState<string | null>(null);
    const [snippetText, setSnippetText] = useState("");
    const [selectedPreset, setSelectedPreset] = useState("custom");
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        const storedSnippet = readStoredSnippet();
        if (storedSnippet) {
            setActiveSnippet(storedSnippet);
            setSnippetText(storedSnippet);
            setSelectedPreset(storedSnippet === DEFAULT_SNIPPET ? "shubpy-default" : "custom");
            setIsOpen(false);
            setHasLoadedConfig(true);
            return;
        }

        setActiveSnippet(null);
        setSnippetText("");
        setSelectedPreset("custom");
        setIsOpen(true);
        setHasLoadedConfig(true);
    }, []);

    useEffect(() => {
        if (!hasLoadedConfig || !activeSnippet) {
            return;
        }

        const existingScript = document.getElementById(SCRIPT_ID);
        if (existingScript) {
            existingScript.remove();
        }

        const parsedScript = extractScriptElement(activeSnippet);
        if (!parsedScript) {
            return;
        }

        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        Array.from(parsedScript.attributes).forEach((attribute) => {
            script.setAttribute(attribute.name, attribute.value);
        });
        script.text = parsedScript.textContent ?? "";
        document.body.appendChild(script);

        return () => {
            script.remove();
        };
    }, [activeSnippet, hasLoadedConfig]);

    const openSettings = () => {
        const currentSnippet = activeSnippet || "";
        setSnippetText(currentSnippet);
        setSelectedPreset(currentSnippet === DEFAULT_SNIPPET ? "shubpy-default" : "custom");
        setStatus(null);
        setIsOpen(true);
    };

    const handlePresetChange = (presetId: string) => {
        setSelectedPreset(presetId);

        const preset = SNIPPET_PRESETS.find((item) => item.id === presetId);
        if (preset) {
            setSnippetText(preset.snippet);
        }
    };

    const handleSave = () => {
        const nextSnippet = snippetText.trim();
        if (!nextSnippet) {
            setStatus("Paste a script tag before saving.");
            return;
        }

        const parsedScript = extractScriptElement(nextSnippet);
        if (!parsedScript) {
            setStatus("The pasted content must include a <script> tag.");
            return;
        }

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ snippet: nextSnippet }));
        setActiveSnippet(nextSnippet);
        setStatus("Saved to localStorage.");
        setIsOpen(false);
        setHasLoadedConfig(true);
    };

    const handleReset = () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setActiveSnippet(null);
        setSnippetText("");
        setSelectedPreset("custom");
        setStatus("Saved snippet cleared. The widget will stay unloaded until you save again.");
        setIsOpen(true);
        setHasLoadedConfig(true);
    };

    return (
        <>
            <button className="widget-settings-fab" type="button" onClick={openSettings}>
                Widget settings
            </button>

            {isOpen ? (
                <div className="widget-config-overlay" role="presentation">
                    <div className="widget-config-modal" role="dialog" aria-modal="true" aria-labelledby="widget-config-title">
                        <div className="widget-config-header">
                            <div>
                                <p className="widget-config-eyebrow">Runtime widget config</p>
                                <h2 id="widget-config-title">Paste the widget script</h2>
                            </div>
                            <button className="widget-config-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close dialog">
                                ×
                            </button>
                        </div>

                        <p className="widget-config-copy">
                            Paste the exact script tag you want to use. It is stored in localStorage and injected on every load until you change it.
                        </p>

                        <label className="form-group widget-config-full">
                            <span>Snippet preset</span>
                            <select value={selectedPreset} onChange={(event) => handlePresetChange(event.target.value)}>
                                {SNIPPET_PRESETS.map((preset) => (
                                    <option key={preset.id} value={preset.id}>
                                        {preset.label}
                                    </option>
                                ))}
                            </select>
                            <span className="hint">Pick the built-in default or keep it custom and paste your own snippet.</span>
                        </label>

                        <label className="form-group widget-config-full">
                            <span>Script snippet</span>
                            <textarea
                                value={snippetText}
                                onChange={(event) => setSnippetText(event.target.value)}
                                placeholder={`<script src="https://chat.shubpy.com/widget.js" data-workspace-key="..." data-modules='[...]' async></script>`}
                                rows={7}
                            />
                            <span className="hint">You can paste a full script tag with any attributes you need.</span>
                        </label>

                        {status ? <p className="widget-config-status">{status}</p> : null}

                        <div className="widget-config-actions">
                            <button className="btn btn-ghost" type="button" onClick={handleReset}>
                                Reset defaults
                            </button>
                            <button className="btn btn-primary" type="button" onClick={handleSave}>
                                Save and load script
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}