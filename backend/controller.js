// backend/controller.js
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const SERVICE_M8_API = process.env.SERVICE_M8_API;
const API_KEY = process.env.SERVICE_M8_KEY;
const usersData = require('./users.json');
const messagesData = require('./messages.js');

const axiosInstance = axios.create({
    baseURL: SERVICE_M8_API,
    headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
    },
});

exports.login = (req, res) => {
    const { email, phone } = req.body;
    const user = usersData.find(u => u.email === email && u.phone === phone);

    if (!user) {
        return res.status(401).json({ error: 'Invalid login' });
    }
    const payload = { uuid: user.uuid, email: user.email, name: user.name };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    console.log(token);
    res.json({ user: payload, token });
};

exports.getCompanies = async (req, res) => {
    const uuid = req.query.uuid;

    try {
        const response = await axiosInstance.get('/company.json');
        const filteredCompanies = response.data.filter(
            c => c.uuid === uuid
        );

        if (filteredCompanies.length === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.json(filteredCompanies);
    } catch (err) {
        console.error('Error fetching companies:', err.message);
        res.status(500).json({ error: 'ServiceM8 API error' });
    }
};

exports.getJobs = async (req, res) => {
    const company_uuid = req.query.company_uuid;

    if (!company_uuid) {
        return res.status(400).json({ error: 'Missing company_uuid parameter' });
    }

    try {
        const response = await axiosInstance.get(`/job.json`);

        const filteredJobs = response.data
            .filter(j => j.active === 1 && j.company_uuid === company_uuid)
            .map(job => {
                const jobMsgs = messagesData[job.uuid] || [];

                const messagesWithFlags = jobMsgs.map(msg => ({
                    ...msg,
                    isCompanyMessage: msg.sender_uid === job.company_uuid
                }));

                return {
                    ...job,
                    messages: messagesWithFlags
                };
            });

        res.json(filteredJobs);
    } catch (err) {
        console.error('Error fetching jobs:', err.message);
        res.status(500).json({ error: 'ServiceM8 API error' });
    }
};


exports.addMessage = (req, res) => {

    console.log(req.body);
    const { jobUUID, sender_uid, text } = req.body;

    if (!jobUUID || !text || !sender_uid) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!messagesData[jobUUID]) messagesData[jobUUID] = [];

    const newMsg = { sender_uid, text, timestamp: new Date() };
    messagesData[jobUUID].push(newMsg);

    console.log(newMsg);

    res.status(201).json(newMsg);
};

exports.getAttachments = async (req, res) => {
    const job_uuid = req.query.job_uuid;
    if (!job_uuid) return res.status(400).json({ error: "Missing job_uuid parameter" });

    try {
        const response = await axiosInstance.get(
            `/Attachment.json?$filter=related_object_uuid eq '${job_uuid}'`
        );

        if (!response.data || !Array.isArray(response.data)) {
            return res.status(500).json({ error: "Invalid response from ServiceM8" });
        }
        const fileUrls = response.data.map(att => `/api/attachment/file/${att.uuid}`);

        res.json(fileUrls);

    } catch (err) {
        console.error("Error fetching attachments:", err.message);
        res.status(500).json({ error: "ServiceM8 API error", details: err.message });
    }
};

exports.getAttachmentFile = async (req, res) => {
    const { uuid } = req.params;
    if (!uuid) return res.status(400).json({ error: "Missing attachment UUID" });

    try {
        const response = await axiosInstance.get(`/Attachment/${uuid}.file`, {
            responseType: "stream",
        });
        res.setHeader("Content-Type", response.headers["content-type"] || "image/jpeg");
        response.data.pipe(res);

    } catch (err) {
        console.error("Error fetching attachment file:", err.message);
        res.status(500).json({ error: "ServiceM8 API error", details: err.message });
    }
};

// authentication
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};
