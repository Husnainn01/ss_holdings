import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  country: string;
  subject: string;
  message: string;
}

interface CarInquiryRequest {
  name: string;
  email: string;
  phone?: string;
  country: string;
  vehicleId: string;
  vehicleName: string;
  message: string;
}

// Email configuration mapping
const EMAIL_CONFIG = {
  'export-inquiry': {
    email: 'vehicel-export@ss.holdings',
    password: 'm4mjEsxY?D{F=][5',
    subject: 'Vehicle Export Inquiry'
  },
  'vehicle-sourcing': {
    email: 'vehicle-securing@ss.holdings', 
    password: '#n$.xs9}l^F^aWqK',
    subject: 'Vehicle Sourcing Request'
  },
  'shipping': {
    email: 'shipping-logistics@ss.holdings',
    password: ';[[2,wfxojx0^j31',
    subject: 'Shipping & Logistics Inquiry'
  },
  'documentation': {
    email: 'document-logistics@ss.holdings',
    password: 'TUYB0k#DR@CswRIB',
    subject: 'Documentation & Compliance'
  },
  'pricing': {
    email: 'pricing-payment@ss.holdings',
    password: 'RYw^[gE70xB[Ztv#',
    subject: 'Pricing & Payment Inquiry'
  },
  'other': {
    email: 'other@ss.holdings',
    password: '!%#&!Cj}Qw,B6LI#',
    subject: 'General Inquiry'
  },
  'car-inquiry': {
    email: 'inquiries@ss.holdings',
    password: 'DIk2j;(kmsNh*H4l',
    subject: 'Vehicle Inquiry'
  }
};

// Create transporter for specific email account
const createTransporter = (emailConfig: typeof EMAIL_CONFIG[keyof typeof EMAIL_CONFIG]) => {
  return nodemailer.createTransport({
    host: 'mail.ss.holdings', // Assuming this is your mail server
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailConfig.email,
      pass: emailConfig.password,
    },
    tls: {
      rejectUnauthorized: false // For development, remove in production if you have proper SSL
    }
  });
};

// Send contact form submission
export const sendContactMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, country, subject, message }: ContactRequest = req.body;

    // Validate required fields
    if (!name || !email || !country || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Get email configuration based on subject
    const emailConfig = EMAIL_CONFIG[subject as keyof typeof EMAIL_CONFIG];
    if (!emailConfig) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject category'
      });
    }

    // Create transporter for the specific department
    const transporter = createTransporter(emailConfig);

    // Email content
    const mailOptions = {
      from: `"${name}" <${emailConfig.email}>`,
      to: emailConfig.email,
      subject: `${emailConfig.subject} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0;">New ${emailConfig.subject}</h2>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
            <h3 style="color: #495057; margin-bottom: 20px;">Contact Information</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; width: 30%;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${email}</td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold;">Phone:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${phone}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold;">Country:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${country}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold;">Category:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${emailConfig.subject}</td>
              </tr>
            </table>
            
            <h3 style="color: #495057; margin: 20px 0 10px 0;">Message</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #007bff;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 12px; color: #6c757d;">
              <p>This message was sent through the SS Holdings contact form on ${new Date().toLocaleString()}.</p>
            </div>
          </div>
        </div>
      `,
      text: `
New ${emailConfig.subject}

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
Country: ${country}
Category: ${emailConfig.subject}

Message:
${message}

This message was sent through the SS Holdings contact form on ${new Date().toLocaleString()}.
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Error sending contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
};

// Send car inquiry
export const sendCarInquiry = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, country, vehicleId, vehicleName, message }: CarInquiryRequest = req.body;

    // Validate required fields
    if (!name || !email || !country || !vehicleId || !vehicleName || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Use car inquiry email configuration
    const emailConfig = EMAIL_CONFIG['car-inquiry'];
    const transporter = createTransporter(emailConfig);

    // Email content for car inquiry
    const mailOptions = {
      from: `"${name}" <${emailConfig.email}>`,
      to: emailConfig.email,
      subject: `Vehicle Inquiry - ${vehicleName} (ID: ${vehicleId})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0;">New Vehicle Inquiry</h2>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
            <h3 style="color: #495057; margin-bottom: 20px;">Vehicle Information</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; width: 30%;">Vehicle:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${vehicleName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold;">Vehicle ID:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${vehicleId}</td>
              </tr>
            </table>
            
            <h3 style="color: #495057; margin-bottom: 20px;">Customer Information</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; width: 30%;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${email}</td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold;">Phone:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${phone}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold;">Country:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${country}</td>
              </tr>
            </table>
            
            <h3 style="color: #495057; margin: 20px 0 10px 0;">Message</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #007bff;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 12px; color: #6c757d;">
              <p>This inquiry was sent through the SS Holdings vehicle page on ${new Date().toLocaleString()}.</p>
              <p>Vehicle URL: ${req.headers.origin}/cars/${vehicleId}</p>
            </div>
          </div>
        </div>
      `,
      text: `
New Vehicle Inquiry

Vehicle: ${vehicleName}
Vehicle ID: ${vehicleId}

Customer Information:
Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
Country: ${country}

Message:
${message}

This inquiry was sent through the SS Holdings vehicle page on ${new Date().toLocaleString()}.
Vehicle URL: ${req.headers.origin}/cars/${vehicleId}
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Inquiry sent successfully'
    });

  } catch (error) {
    console.error('Error sending car inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send inquiry. Please try again later.'
    });
  }
}; 