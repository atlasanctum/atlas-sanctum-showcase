import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Atlas Sanctum?",
    answer:
      "Atlas Sanctum is a cinematic vision of Earth's regenerative future. It's a 3-minute trailer featuring voiceover, orchestral score, and stunning visuals that explore how humanity could transform from extraction-based systems to regeneration-based ones.",
  },
  {
    question: "Is this a real project or a fictional vision?",
    answer:
      "Atlas Sanctum is a speculative vision—a blueprint for what could be possible if we make different choices today. While the specific technologies and timeline are imaginative, they're grounded in real regenerative principles and emerging innovations.",
  },
  {
    question: "What does 'regeneration' mean in this context?",
    answer:
      "Regeneration means creating systems where human activity actively heals and restores ecosystems, rather than depleting them. It's about designing economies and technologies that produce more value for all life, not just humans.",
  },
  {
    question: "How can I use this project?",
    answer:
      "You can watch the trailer, explore the storyboard, read about the vision, and share it with others. It's designed to inspire conversations about what's possible and to serve as a catalyst for thinking about regenerative futures.",
  },
  {
    question: "What's the significance of the year 2075?",
    answer:
      "2075 represents a turning point—roughly 50 years from now. It's far enough to imagine significant transformation, but close enough to feel urgent. It suggests that the choices we make today will determine what Earth looks like in that timeframe.",
  },
  {
    question: "Can I download or share this content?",
    answer:
      "Yes! We encourage sharing. You can share the website link, the audio, and the images. For specific licensing or usage questions, please reach out through the contact section.",
  },
  {
    question: "How was this project created?",
    answer:
      "Atlas Sanctum was created using AI-assisted tools for scriptwriting, image generation, voiceover synthesis, music composition, and web development. It demonstrates how creative vision and technology can collaborate to bring ambitious ideas to life.",
  },
  {
    question: "What's the call to action?",
    answer:
      "The primary call to action is to imagine differently. To ask yourself: What if intelligence was not the power to dominate the world, but the wisdom to restore it? From there, explore regenerative practices, support organizations working on these solutions, and contribute your own skills to the transformation.",
  },
];

export function FAQ() {
  return (
    <section className="py-20 md:py-32">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="accent-line mx-auto mb-6 w-12" />
          <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Learn more about Atlas Sanctum and the vision it represents
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-lg px-6 data-[state=open]:border-accent/50 transition-colors"
            >
              <AccordionTrigger className="text-lg font-semibold font-['Space_Grotesk'] uppercase tracking-wider text-foreground hover:text-accent transition-colors py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
