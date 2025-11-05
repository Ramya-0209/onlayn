import {
  FacebookShareButton,
  WhatsappShareButton,
  FacebookIcon,
  WhatsappIcon,
} from "react-share";
import { FaInstagram } from "react-icons/fa";

const ShareButtons = ({
  product,
  currentDiscount,
  discountedPrice,
  currentPrice,
}) => {
  if (!product) return null;

  const productUrl = `https://toyshack.in/product/${product._id}`;
  const websiteUrl = "https://toyshack.in/";
  const sharePrice = currentDiscount > 0 ? discountedPrice : currentPrice;

  const shareMessage = `🧸 ${product.productName}
  💰Price: ₹${Math.round(Number(sharePrice))}
  Website: ${websiteUrl}
  Check it out:`;  

  const handleInstaShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.productName,
          text: shareMessage,
          url: productUrl,
        });
      } else {
        alert("Sharing not supported on this browser. Please try on mobile.");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="flex gap-3 items-center">
      {/* WhatsApp */}
      <WhatsappShareButton url={productUrl} title={shareMessage} separator=" ">
        <WhatsappIcon size={40} round />
      </WhatsappShareButton>

      {/* Instagram (Web Share API) */}
      <button
        onClick={handleInstaShare}
        className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white cursor-pointer"
      >
        <FaInstagram size={22} />
      </button>

      {/* Facebook */}
      <FacebookShareButton url={productUrl} quote={shareMessage}>
        <FacebookIcon size={40} round />
      </FacebookShareButton>
    </div>
  );
};

export default ShareButtons;

