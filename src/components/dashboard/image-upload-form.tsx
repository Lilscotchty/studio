
"use client";

import React, { useState, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Image from "next/image";
import { handleImageAnalysisAction, type AnalysisResult } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Loader2, UploadCloud } from "lucide-react";
import { PredictionResults } from "./prediction-results";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <UploadCloud className="mr-2 h-4 w-4" />
          Analyze Chart
        </>
      )}
    </Button>
  );
}

export function ImageUploadForm() {
  const initialState: AnalysisResult | undefined = undefined;
  const [state, formAction] = useFormState(handleImageAnalysisAction, initialState);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // To reset formState, we'd need to re-initialize the form or pass a reset action to useFormState if it supported it.
    // For now, this just clears the visual preview and input. The `state` from useFormState will persist until next submission.
    // A full reset of `state` would typically involve a new key on the form or component.
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Upload Candlestick Chart</CardTitle>
          <CardDescription>
            Upload an image of a candlestick chart to get AI-powered market predictions and analysis.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="chartImage" className="text-base">Chart Image</Label>
              <Input
                id="chartImage"
                name="chartImage"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                required
                onChange={handleFileChange}
                ref={fileInputRef}
                className="file:text-foreground file:font-medium file:bg-muted file:border-0 file:px-4 file:py-2 file:rounded-md file:mr-4 hover:file:bg-accent"
              />
            </div>

            {previewUrl && (
              <div className="mt-4 border border-dashed border-border rounded-lg p-4 flex justify-center items-center bg-muted/20">
                <Image
                  src={previewUrl}
                  alt="Chart preview"
                  width={400}
                  height={300}
                  className="rounded-md object-contain max-h-[300px]"
                  data-ai-hint="chart finance"
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex-grow w-full sm:w-auto">
             {state?.error && (
                <Alert variant="destructive" className="mb-4 sm:mb-0">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}
              {!state?.error && state?.prediction && (
                 <Alert variant="default" className="mb-4 sm:mb-0 border-green-500 text-green-500 [&>svg]:text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Analysis Complete</AlertTitle>
                  <AlertDescription>Scroll down to see the results.</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button type="button" variant="outline" onClick={handleReset} className="w-full sm:w-auto">
                Reset
              </Button>
              <SubmitButton />
            </div>
          </CardFooter>
        </form>
      </Card>

      {state?.prediction && state?.analysis && (
        <PredictionResults 
          prediction={state.prediction} 
          analysis={state.analysis} 
          imagePreviewUrl={state.imagePreviewUrl} 
        />
      )}
    </div>
  );
}
