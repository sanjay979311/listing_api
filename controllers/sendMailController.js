


// import { sendMail } from '../utiles/nodemailer.js'

// export const sendEmail = async (req, res) => {
//     try {
//         const { email } = req.body;

//         if (!email) {
//             return res.status(400).json({ error: "Email is required" });
//         }

//         const emailResponse = await sendMail({
//             to: email,
//             subject: "Order Expiring Soon",
//             text: "Your order is expiring soon. Please take action.",
//             html: "<h1>Order Expiring Soon</h1><p>Your order is expiring soon. Please take action.</p>",
//         });

//         if (emailResponse.success) {
//             res.status(200).json({ message: "Email sent successfully" });
//         } else {
//             res.status(500).json({ error: "Failed to send email" });
//         }
//     } catch (error) {
//         console.error("Server error:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };


// import { sendMail } from '../utils/nodemailer.js';


import { sendMail } from '../utiles/nodemailer.js'
// import fs from 'fs/promises';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

export const sendEmail = async (req, res) => {
    try {
        const { email, name, expiryDate } = req.body;

        if (!email || !name || !expiryDate) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Load and compile the email template
        // const templatePath = path.join(process.cwd(), "emailTemplates", "orderExpiryTemplate.html");
        const templatePath = path.join(process.cwd(), "utiles", "emailTemplates", "orderExpiryTemplate.html");
        const templateFile = await fs.readFile(templatePath, "utf-8");
        const template = handlebars.compile(templateFile);

        // Create dynamic content
        const renewalLink = `https://yourwebsite.com/renew?email=${email}`;
        const htmlContent = template({ name, expiryDate, renewalLink });

        // Send email
        const emailResponse = await sendMail({
            to: email,
            subject: "Order Expiring Soon",
            text: `Dear ${name}, your order is expiring on ${expiryDate}. Renew now: ${renewalLink}`,
            html: htmlContent,
        });

        if (emailResponse.success) {
            res.status(200).json({ message: "Email sent successfully" });
        } else {
            res.status(500).json({ error: "Failed to send email" });
        }
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};





export const orderConfirm = async (req, res) => {
    try {
        const {
            email,
            customerName,
            customerId,
            orderId,
            address,
            paymentMethod,
            paymentStatus,
            orderStatus,
            orderDate,
            shippingCharge = 0,
            tax = 0,
            totalBeforeDiscount = 0,
            discount = 0,
            totalAfterDiscount = 0,
            products = [],
        } = req.body;

        if (!email || (!customerName && !customerId?.fullName) || !orderId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const finalCustomerName = customerName || customerId.fullName || "Customer";

        // Load HTML template
        const templatePath = path.join(process.cwd(), 'public', 'template', 'orderConfirmation.html');
        const templateSource = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateSource);

        // Generate table rows from nested product structure
        const productTableRows = products.map((item, index) => {
            const product = item.product || {};
            const name = product.name || "Unnamed Product";
            const quantity = item.quantity || 0;
            const price = item.priceAtOrder || product.price || 0;
            const total = (quantity * price).toFixed(2);

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${name}</td>
                    <td>${quantity}</td>
                    <td>₹${price}</td>
                    <td>₹${total}</td>
                </tr>
            `;
        }).join("");

        // Compile email HTML
        const htmlContent = template({
            customerName: finalCustomerName,
            orderId,
            address,
            orderDate,
            paymentMethod,
            paymentStatus,
            orderStatus,
            shippingCharge,
            tax,
            totalBeforeDiscount,
            discount,
            totalAfterDiscount,
            productTable: productTableRows,
        });

        console.log("📤 Sending email to:", email);
        console.log("🧾 Order ID:", orderId);
        console.log("🧾 Table HTML:\n", productTableRows);

        // Send the email
        const emailResponse = await sendMail({
            to: email,
            subject: `🧾 Order Confirmation - ${orderId}`,
            text: `Hi ${finalCustomerName}, your order (${orderId}) has been placed successfully.`,
            html: htmlContent,
        });

        if (emailResponse.success) {
            return res.status(200).json({ message: "Order confirmation email sent successfully" });
        } else {
            return res.status(500).json({ error: "Failed to send email" });
        }

    } catch (error) {
        console.error("❌ Error sending order confirmation:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

