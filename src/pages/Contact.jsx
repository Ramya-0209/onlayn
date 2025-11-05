import React, { useState, useEffect} from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import API from "../api";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "", 
    email: "",
    message: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        message: "",
      });
      return;
    }
  
    try {
      const storedEmail = localStorage.getItem("email") || "";
      const storedFirstName = localStorage.getItem("firstName") || "";
      const storedLastName = localStorage.getItem("lastName") || "";
      const storedMobileNumber = localStorage.getItem("mobileNumber") || "";
  
      const clean = (str) => str.replace(/^"|"$/g, "");
  
      setFormData({
        firstName: clean(storedFirstName),
        lastName: clean(storedLastName),
        phone: clean(storedMobileNumber),
        email: clean(storedEmail),
        message: "",
      });
    } catch (error) {
      console.error("❌ Error loading profile data:", error);
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "phone" ? value.replace(/\D/g, "") : value, 
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const { firstName, lastName, phone, email, message } = formData;
  
  //   if (!firstName || !lastName || !phone || !email || !message) {
  //     toast.error("Please fill in all required fields.");
  //     return;
  //   }
  
  //   const AUTH_TOKEN = localStorage.getItem('token'); 
  //   if (!AUTH_TOKEN) {
  //     toast.error("Authentication token not found. Please log in.");
  //     return;
  //   }
  
  //   const requestBody = {
  //     firstName,
  //     lastName,
  //     mobileNumber: phone,
  //     email,
  //     message,
  //   };
  
  //   let retries = 0;
  //   const maxRetries = 5;
  //   const baseDelay = 1000;
  
  //   const toastId = toast.loading("Submitting your message...");

  //   while (retries < maxRetries) {
  //     try {
  //       const response = await API.post("/Dashboard/contactus/create-Support", requestBody, {
  //         headers: {
  //           "Authorization": `Bearer ${AUTH_TOKEN}`,
  //         },
  //       });
  
  //       if (response.status === 200 || response.status === 201) {
  //         toast.success("Message sent successfully!", {id: toastId});
  //         setFormData({ firstName: "", lastName: "", phone: "", email: "", message: "" });
  //         break;
  //       } else {
  //         const errorMessage = response.data?.message || response.statusText || "Unknown error";
  //         toast.error(`Failed to send message: ${errorMessage}`, {id: toastId});
  //         break;
  //       }
  //     } catch (error) {
  //       retries++;
  //       if (retries === maxRetries) {
  //         const errorMessage = error.response?.data?.message || error.message || "Unknown error";
  //         toast.error(`Failed after multiple attempts: ${errorMessage}`, {id: toastId});
  //       } else {
  //         const delay = baseDelay * Math.pow(2, retries - 1);
  //         await new Promise((resolve) => setTimeout(resolve, delay));
  //       }
  //     }
  //   }
  // };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, phone, email, message } = formData;
  
    if (!firstName || !phone || !email || !message) {
      toast.error("Please fill in all required fields.");
      return;
    }
  
    const requestBody = {
      firstName,
      lastName,
      mobileNumber: phone,
      email,
      message,
    };
  
    let retries = 0;
    const maxRetries = 5;
    const baseDelay = 1000;
  
    const toastId = toast.loading("Submitting your message...");
  
    while (retries < maxRetries) {
      try {
        const response = await API.post(
          "https://apis.toyshack.in/App/contactus/create-Support",
          requestBody
        );
  
        if (response.status === 200 || response.status === 201) {
          toast.success("Message sent successfully!", { id: toastId });
          setFormData({
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            message: "",
          });
          break;
        } else {
          const errorMessage =
            response.data?.message || response.statusText || "Unknown error";
          toast.error(`Failed to send message: ${errorMessage}`, { id: toastId });
          break;
        }
      } catch (error) {
        retries++;
        if (retries === maxRetries) {
          const errorMessage =
            error.response?.data?.message || error.message || "Unknown error";
          toast.error(`Failed after multiple attempts: ${errorMessage}`, {
            id: toastId,
          });
        } else {
          const delay = baseDelay * Math.pow(2, retries - 1);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  };
  
  return (
    <section className="bg-white py-12 px-4 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-pink-500 mb-16">Contact Us</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <motion.div
            className="lg:col-span-2 bg-gray-50 p-8 rounded-3xl shadow-md"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-700 mb-15">Send a Message</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">Message</label>
                <textarea
                  rows="5"
                  name="message"
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 transition font-semibold cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </motion.div>

          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-pink-100 to-yellow-100 p-6 rounded-3xl shadow-md space-y-6">
              <h3 className="text-xl font-bold text-pink-600">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-2 rounded-full shadow">
                    <MapPin className="text-pink-500 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Visit Us</p>
                    <p className="text-sm text-gray-600">
                      <a
                        href="https://maps.app.goo.gl/bD63RZ87YRkSUH7n9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-pink-600"
                      >
                        D. No. 25-84/42/FF502, Venu Dharani Apartment, P.M Palem, Revenue Ward 4,
                        Visakhapatnam, Andhra Pradesh - 530048
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white p-2 rounded-full shadow">
                    <Phone className="text-pink-500 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Phone</p>
                    <a
                      href="tel:+918121301888"
                      className="text-sm text-gray-700 hover:text-pink-600 transition block"
                    >
                      +91 8121301888
                    </a>
                    <a
                      href="tel:+918121304888"
                      className="text-sm text-gray-700 hover:text-pink-600 transition block"
                    >
                      +91 8121304888
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white p-2 rounded-full shadow">
                    <Mail className="text-pink-500 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Email</p>
                    <a
                      href="mailto:hello.toyshack@gmail.com"
                      className="text-sm text-gray-700 hover:text-pink-600 transition"
                    >
                      hello.toyshack@gmail.com
                    </a>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/40 pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-1">Working Hours</p>
                <p className="text-sm text-gray-700">Mon – Sat: 9:00 AM – 6:00 PM</p>
                <p className="text-sm text-gray-700">Sunday: Closed</p>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-md">
              <iframe
                title="ToyShack Location"
                src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d121558.9356994313!2d83.2680940476177!3d17.805004849118255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x3a395b0bb73f527b%3A0xc22e34a10b1907c!2sR942%2B255%2C%20Anand%20Nagar%2C%20Pothinamallayya%20Palem%2C%20Visakhapatnam%2C%20Andhra%20Pradesh%20530041!3m2!1d17.8050306!2d83.3504596!5e0!3m2!1sen!2sin!4v1756873582295!5m2!1sen!2sin"
                width="100%"
                height="250"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;