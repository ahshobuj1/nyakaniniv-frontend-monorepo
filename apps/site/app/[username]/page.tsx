import TemplateRenderer from "@repo/builder";

export default function Page() {
  return (
    <TemplateRenderer
      templateId="azura"
      content={{ heroTitle: "DJ Shobuj" }}
      theme={{ primaryColor: "red", fontFamily: "Poppins" }}
    />
  );
}
