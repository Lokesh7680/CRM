import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { ClipboardCopyIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmailTemplateCard = ({ template }) => {
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(template.mjml);
    toast.success("MJML copied!");
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md space-y-2 border hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{template.name}</h3>
        <div className="flex gap-2 items-center">
          <Button size="sm" variant="secondary" onClick={handleCopy}>
            <ClipboardCopyIcon size={16} className="mr-1" />
            Copy MJML
          </Button>
          <Button size="sm" onClick={() => navigate(`/email-templates/preview/${template.id}`)}>
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateCard;
