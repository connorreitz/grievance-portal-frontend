import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { FileText, Heart } from "lucide-react";

const grievanceSchema = z.object({
  grievance: z.string().trim().min(10, "Please provide at least 10 characters").max(500, "Keep it under 500 characters"),
  severity: z.enum(["minor", "moderate", "severe"], {
    required_error: "Please select a severity level",
  }),
  date: z.string().min(1, "Please select a date"),
});

type GrievanceFormValues = z.infer<typeof grievanceSchema>;

const Index = () => {
  const [submissionCount, setSubmissionCount] = useState(0);

  const form = useForm<GrievanceFormValues>({
    resolver: zodResolver(grievanceSchema),
    defaultValues: {
      grievance: "",
      severity: undefined,
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: GrievanceFormValues) => {
    console.log("Grievance submitted:", data);
    
    try {
      // TODO: Replace with actual backend endpoint URL
      const response = await fetch('https://m5z5ph9dud.execute-api.us-east-2.amazonaws.com/Prod/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: data.grievance,
          severity: data.severity,
          date: data.date,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit grievance');
      }

      const result = await response.json();
      console.log("Backend response:", result);

      setSubmissionCount((prev) => prev + 1);
      toast.success("Grievance filed successfully!", {
        description: "Connor will look at this soon potentially",
      });
      form.reset({
        grievance: "",
        severity: undefined,
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Error submitting grievance:", error);
      toast.error("Failed to submit grievance", {
        description: "Please try again later",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="container max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Hi Audge</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            What's wrong?
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Finally made the grievance portal you're welcome
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 text-center animate-in fade-in slide-in-from-top duration-700 delay-100">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-card rounded-lg shadow-[var(--shadow-soft)] border border-border">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">
              Total Grievances Filed: <span className="text-primary font-bold">{submissionCount}</span>
            </span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-[var(--shadow-soft)] border-border animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <CardHeader>
            <CardTitle className="text-2xl">Grievance Details</CardTitle>
            <CardDescription>
              Please provide detailed information about your grievance. All fields ARE required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Grievance Description */}
                <FormField
                  control={form.control}
                  name="grievance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grievance here please</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What did I do this time?"
                          className="min-h-[120px] resize-none transition-all duration-300 focus:shadow-[var(--shadow-soft)]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Severity Level */}
                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Severity Level</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="minor" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Silly (e.g. missed your ft)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="moderate" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Stinky (e.g. tackled you to the ground outside Snookers)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="severe" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Severe (e.g. i hate and despise you)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date of Incident */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Incident</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="transition-all duration-300 focus:shadow-[var(--shadow-soft)]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full transition-all duration-300 hover:shadow-[var(--shadow-soft)] hover:scale-[1.02]"
                  size="lg"
                >
                  Submit Grievance
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-muted-foreground animate-in fade-in duration-700 delay-300">
          <p>i hope you don't use this for anything serious</p>
          <p className="mt-1">and hopefully the sending me a text message actually works</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
