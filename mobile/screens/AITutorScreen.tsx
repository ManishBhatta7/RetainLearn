import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export default function AITutorScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('tutor');
  const [selectedModel, setSelectedModel] = useState('gemini');
  const scrollRef = useRef(null);

  const modes = [
    { id: 'tutor', label: 'Tutor' },
    { id: 'socratic', label: 'Socratic' },
    { id: 'coach', label: 'Coach' },
    { id: 'eli5', label: 'Simple' },
  ];

  const models = [
    { id: 'gemini', label: 'Gemini' },
    { id: 'gpt', label: 'GPT-4' },
    { id: 'deepseek', label: 'DeepSeek' },
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('gemini-agent', {
        body: {
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mode,
          language: 'en',
        },
      });

      if (error) {
        throw error;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data?.reply || 'I encountered an error. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: `Error: ${err.message || 'Failed to get response'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Mode Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.modeSelector}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {modes.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.modeButton,
                mode === m.id && styles.modeButtonActive,
              ]}
              onPress={() => setMode(m.id)}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  mode === m.id && styles.modeButtonTextActive,
                ]}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Model Selector */}
        <View style={styles.modelSelector}>
          <Text style={styles.modelLabel}>Model:</Text>
          {models.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.modelButton,
                selectedModel === m.id && styles.modelButtonActive,
              ]}
              onPress={() => setSelectedModel(m.id)}
            >
              <Text style={styles.modelButtonText}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Messages */}
        <FlatList
          ref={scrollRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                item.role === 'user'
                  ? styles.userMessageContainer
                  : styles.modelMessageContainer,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  item.role === 'user'
                    ? styles.userMessageBubble
                    : styles.modelMessageBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    item.role === 'user'
                      ? styles.userMessageText
                      : styles.modelMessageText,
                  ]}
                >
                  {item.content}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                👋 Start learning! Ask me anything.
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 12 }}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask a question..."
            value={input}
            onChangeText={setInput}
            editable={!isLoading}
            multiline
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (isLoading || !input.trim()) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  modeSelector: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  modeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 4,
  },
  modeButtonActive: {
    backgroundColor: '#2563eb',
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  modeButtonTextActive: {
    color: '#ffffff',
  },
  modelSelector: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
  },
  modelLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginRight: 8,
  },
  modelButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  modelButtonActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#2563eb',
  },
  modelButtonText: {
    fontSize: 11,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  messageContainer: {
    marginVertical: 4,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  modelMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  userMessageBubble: {
    backgroundColor: '#2563eb',
  },
  modelMessageBubble: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  userMessageText: {
    color: '#ffffff',
  },
  modelMessageText: {
    color: '#1f2937',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1f2937',
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
});
