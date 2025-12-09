import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const DeepSeekTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);
  const [chatResult, setChatResult] = useState<{ success: boolean; response?: string; error?: string } | null>(null);

  const testDeepSeek = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-deepseek');
      
      if (error) throw error;
      setTestResult(data);
    } catch (error) {
      console.error('Error testing DeepSeek:', error);
      setTestResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const chatWithDeepSeek = async () => {
    if (!prompt.trim()) return;
    
    setIsChatting(true);
    setChatResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('deepseek-chat', {
        body: { 
          message: prompt.trim()
        }
      });
      
      if (error) throw error;
      setChatResult(data);
    } catch (error) {
      console.error('Error chatting with DeepSeek:', error);
      setChatResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Test DeepSeek API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testDeepSeek} 
            disabled={isLoading}
          >
            {isLoading ? 'Testing...' : 'Test DeepSeek Connection'}
          </Button>

          {testResult && (
            <Alert variant={testResult.success ? "default" : "destructive"}>
              <AlertTitle>
                {testResult.success ? 'Success!' : 'Error'}
              </AlertTitle>
              <AlertDescription>
                {testResult.success ? testResult.message : testResult.error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Chat with DeepSeek</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Ask DeepSeek anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
          
          <Button 
            onClick={chatWithDeepSeek} 
            disabled={isChatting || !prompt.trim()}
          >
            {isChatting ? 'Generating...' : 'Send to DeepSeek'}
          </Button>

          {chatResult && (
            <Alert variant={chatResult.success ? "default" : "destructive"}>
              <AlertTitle>
                {chatResult.success ? 'DeepSeek Response:' : 'Error'}
              </AlertTitle>
              <AlertDescription className="whitespace-pre-wrap">
                {chatResult.success ? chatResult.response : chatResult.error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepSeekTest;