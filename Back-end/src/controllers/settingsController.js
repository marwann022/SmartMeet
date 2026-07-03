import Setting from "../models/Setting.js";

export const getWebhook = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Admin only" });
        }
        let setting = await Setting.findOne({ key: "webhook_url" });
        return res.status(200).json({ success: true, url: setting?.value || "" });
    } catch (error) {
        console.error("Get webhook error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const saveWebhook = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Admin only" });
        }
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ success: false, message: "URL is required" });
        }
        await Setting.updateOne({ key: "webhook_url" }, { $set: { value: url } }, { upsert: true });
        return res.status(200).json({ success: true, message: "Webhook URL saved" });
    } catch (error) {
        console.error("Save webhook error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const testWebhook = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Admin only" });
        }
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ success: false, message: "URL is required" });
        }
        const payload = { event: "test", timestamp: new Date().toISOString(), message: "SmartMeet webhook test" };
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (response.ok) {
            return res.status(200).json({ success: true, message: "Webhook test sent successfully" });
        }
        return res.status(502).json({ success: false, message: `Webhook responded with ${response.status}` });
    } catch (error) {
        console.error("Test webhook error:", error);
        res.status(502).json({ success: false, message: error.message });
    }
};
