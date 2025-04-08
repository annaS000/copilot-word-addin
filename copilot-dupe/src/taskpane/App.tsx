import React, { useState, useEffect } from 'react';
import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
  Button,
  Dropdown,
  Option,
  Tooltip,
  Menu,
  MenuList,
  MenuItem,
  MenuPopover,
  Text,
  Textarea,
  tokens,
  makeStyles,
  MenuTrigger
} from '@fluentui/react-components';
import {
  Send24Regular,
  TextBulletList24Regular,
  DocumentEdit24Regular,
  BookSearch24Regular,
  TextGrammarArrowRight24Regular,
  TextT24Regular,
  DocumentCopy24Regular,
  DocumentBulletList24Regular
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateRows: 'auto auto 1fr auto',
    height: '100vh',
    maxHeight: '100vh',
    overflow: 'hidden'
  },
  dropdown: {
    padding: '0.75rem 1rem',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    '& div[role="combobox"]': {
      border: 'none',
      background: 'transparent',
      boxShadow: 'none',
      minWidth: 0,
      padding: 0
    },
    '& .fui-Dropdown__button': {
      display: 'inline-flex',
      justifyContent: 'flex-start',
      width: 'auto'
    },
    '& .fui-Dropdown__expandIcon': {
      marginLeft: '0.25rem',
      marginRight: 'auto'
    }
  },
  quickActions: {
    display: 'flex',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    overflowX: 'auto',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    '& button': {
      minWidth: 'auto',
      height: '2rem',
      padding: '0 0.5rem',
      background: 'transparent',
      color: tokens.colorNeutralForeground2,
      ':hover': {
        background: tokens.colorNeutralBackground3,
        color: tokens.colorNeutralForeground1
      }
    }
  },
  commandMenu: {
    width: '100%',
    background: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: '0.25rem',
    boxShadow: tokens.shadow8,
    maxHeight: '300px',
    overflow: 'auto',
    zIndex: 1000
  },
  commandGroup: {
    padding: '0.5rem',
    '& h3': {
      margin: '0 0 0.5rem 0',
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      color: tokens.colorNeutralForeground3,
      padding: '0 0.5rem'
    }
  },
  messages: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    padding: '1rem'
  },
  messageItem: {
    display: 'flex',
    width: '100%',
    marginBottom: '0.5rem',
    '&[data-sender="user"]': {
      justifyContent: 'flex-end',
      '& > div': {
        backgroundColor: tokens.colorNeutralBackground3,
        color: tokens.colorNeutralForeground1,
        borderRadius: '1rem'
      },
      '&[data-type="command"]': {
        '& > div': {
          backgroundColor: tokens.colorBrandBackground,
          color: tokens.colorNeutralForegroundOnBrand
        }
      }
    },
    '&[data-sender="ai"]': {
      '& > div': {
        background: 'transparent',
        borderBottomLeftRadius: '0.25rem'
      }
    },
    '&[data-status="loading"]': {
      '& > div': {
        backgroundColor: tokens.colorNeutralBackground2,
        color: tokens.colorNeutralForeground3
      }
    },
    '&[data-status="error"]': {
      '& > div': {
        backgroundColor: tokens.colorStatusDangerBackground1,
        color: tokens.colorStatusDangerForeground1
      }
    }
  },
  messageBubble: {
    maxWidth: '80%',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.4',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  input: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',
    '& textarea': {
      width: '100%',
      resize: 'none',
      border: 'none',
      background: 'transparent',
      fontSize: '0.875rem',
      lineHeight: '1.4',
      padding: '0.5rem',
      color: tokens.colorNeutralForeground1,
      ':focus': {
        outline: 'none'
      },
      '::placeholder': {
        color: tokens.colorNeutralForeground4
      }
    },
    '& button': {
      width: '32px',
      height: '32px',
      padding: '0.25rem',
      border: 'none',
      background: 'transparent',
      color: tokens.colorNeutralForeground3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ':hover': {
        color: tokens.colorNeutralForeground2
      },
      ':disabled': {
        color: tokens.colorNeutralForegroundDisabled
      }
    }
  },
  loadingDots: {
    display: 'inline-block',
    width: '1.5em',
    animation: 'blink 1.4s infinite both',
    '@keyframes blink': {
      '0%': { opacity: 0.2 },
      '20%': { opacity: 1 },
      '100%': { opacity: 0.2 }
    }
  },
  formatPreview: {
    backgroundColor: 'white',
    padding: '1em',
    border: '1px solid #ccc',
    borderRadius: '4px',
    margin: '1em 0',
    fontFamily: 'Arial, sans-serif'
  }
});

const models = [
  { key: 'gpt-4o', value: 'GPT-4o' },
  { key: 'gpt-4', value: 'GPT-4' },
  { key: 'gpt-3.5-turbo', value: 'GPT-3.5' },
  { key: 'claude-2', value: 'Claude 2' },
  { key: 'claude-instant', value: 'Claude Instant' }
];

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'command' | 'response';
  status?: 'loading' | 'success' | 'error';
  formattedText?: string;
  formattedHtml?: string;
  isHtml?: boolean;
}

interface Command {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: JSX.Element;
}

const commands: Command[] = [
  {
    id: 'summarize',
    category: 'Smart Text',
    title: 'Summarize Selection',
    description: 'Create a concise summary of the selected text',
    icon: <TextBulletList24Regular />
  },
  {
    id: 'improve',
    category: 'Smart Text',
    title: 'Improve Writing Style',
    description: 'Enhance clarity and readability',
    icon: <DocumentEdit24Regular />
  },
  {
    id: 'research',
    category: 'Research',
    title: 'Research Topic',
    description: 'Find relevant information and sources',
    icon: <BookSearch24Regular />
  },
  {
    id: 'format',
    category: 'Smart Text',
    title: 'Format Text',
    description: 'Apply consistent formatting and structure',
    icon: <TextT24Regular />
  }
];

const quickActions = [
  { id: 'summarize', icon: <TextBulletList24Regular />, label: 'Summarize' },
  { id: 'improve', icon: <DocumentEdit24Regular />, label: 'Improve' },
  { id: 'research', icon: <BookSearch24Regular />, label: 'Research' },
  { id: 'format', icon: <TextT24Regular />, label: 'Format' }
];

export default function App(): JSX.Element {
  const styles = useStyles();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkTheme(darkModeMediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkTheme(e.matches);
    darkModeMediaQuery.addEventListener('change', handler);
    return () => darkModeMediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const welcomeMessage: Message = {
      text: `Hi! I'm GPT-4o, your AI writing assistant. I can help you with:\n\n` +
            `📝 Writing and editing\n` +
            `📚 Research and analysis\n` +
            `✨ Text formatting\n` +
            `📋 Summarization\n\n` +
            `You can type a message or use the quick action buttons above. How can I help you today?`,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Check if we're waiting for formatting preferences
    const lastMessage = messages[messages.length - 1];
    const isAwaitingFormatPreferences = lastMessage?.text.includes('Please specify your formatting preferences');
    const isAwaitingFormatConfirmation = lastMessage?.text.includes('Would you like to apply these changes?');

    if (isAwaitingFormatConfirmation) {
      const confirmation = inputValue.trim().toLowerCase();
      const newMessage: Message = {
        text: inputValue,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setInputValue('');

      if (confirmation === 'yes' || confirmation === 'y') {
        setIsLoading(true);

        try {
          // Find the message containing the formatted text
          const formatResultMessage = messages.find(msg => 
            msg.type === 'response' && msg.formattedText
          );
          
          console.log('Found format result message:', formatResultMessage);

          if (!formatResultMessage?.formattedText) {
            throw new Error('Could not find the formatted text. Please try formatting again.');
          }

          // Apply the formatted text to the Word document
          await Word.run(async (context) => {
            const selection = context.document.getSelection();
            
            // First insert the text
            selection.insertText(formatResultMessage.formattedText, Word.InsertLocation.replace);
            
            // Then apply formatting
            const range = selection.getRange();
            
            // Apply double spacing
            range.paragraphs.load('text');
            await context.sync();
            
            range.paragraphs.items.forEach(paragraph => {
              // Set line spacing to double
              paragraph.lineSpacing = 2.0;
              
              // Add space after paragraph (12 points is standard)
              paragraph.spaceAfter = 12;
              
              // Ensure first line indent is set properly
              paragraph.firstLineIndent = 36; // 0.5 inch in points (72 points = 1 inch)
            });
            
            await context.sync();
          });

          const confirmationMessage: Message = {
            text: 'Changes applied successfully!',
            sender: 'ai',
            timestamp: new Date(),
            status: 'success'
          };
          setMessages(prev => [...prev, confirmationMessage]);
        } catch (error) {
          console.error('Format application error:', error);
          const errorMessage: Message = {
            text: error instanceof Error ? error.message : 'Failed to apply formatting changes.',
            sender: 'ai',
            timestamp: new Date(),
            status: 'error'
          };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      } else if (confirmation === 'no' || confirmation === 'n') {
        const cancelMessage: Message = {
          text: 'Format changes cancelled.',
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, cancelMessage]);
      }
      return;
    }

    if (isAwaitingFormatPreferences) {
      const formatPreferences = inputValue.trim();
      console.log('Format preferences:', formatPreferences); // Debug log

      const newMessage: Message = {
        text: formatPreferences,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setInputValue('');
      setIsLoading(true);

      // Add loading message
      const loadingMessage: Message = {
        text: 'Generating formatted preview...',
        sender: 'ai',
        timestamp: new Date(),
        status: 'loading'
      };
      setMessages(prev => [...prev, loadingMessage]);

      try {
        const text = await getSelectedOrFullText();
        if (!text) {
          throw new Error('No text found in the document.');
        }

        // Prepare request data
        const requestData = {
          text: text,
          format_preferences: formatPreferences,
          model_name: selectedModel,
          provider: 'openai'
        };
        console.log('Sending format request with data:', requestData); // Debug log

        const response = await fetch('https://localhost:5001/api/llm/format', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
          credentials: 'include'
        });

        console.log('Format response status:', response.status); // Debug log
        
        const responseText = await response.text();
        console.log('Raw response text:', responseText); // Debug log

        if (!response.ok) {
          let errorMessage = 'Format request failed';
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            console.error('Failed to parse error response:', e);
          }
          throw new Error(errorMessage);
        }

        let data;
        try {
          data = JSON.parse(responseText);
          console.log('Parsed format response:', data); // Debug log
        } catch (e) {
          console.error('Failed to parse response JSON:', e);
          throw new Error('Invalid response format from server');
        }

        if (!data.formatted_text_html || !data.formatted_text) {
          console.error('Missing required fields in response:', data);
          throw new Error('Invalid response: missing formatted text');
        }
        
        // Replace loading message with result
        const resultMessage: Message = {
          text: formatResponse('format', data),
          sender: 'ai',
          timestamp: new Date(),
          type: 'response',
          status: 'success',
          formattedText: data.formatted_text,
          formattedHtml: data.formatted_text_html,
          isHtml: true
        };

        console.log('Created result message:', resultMessage); // Debug log

        setMessages(prev => prev.map((msg, idx) => 
          idx === prev.length - 1 ? resultMessage : msg
        ));

        // Add confirmation request message
        const confirmMessage: Message = {
          text: 'Would you like to apply these changes? (Yes/No)',
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, confirmMessage]);
      } catch (error) {
        console.error('Format error:', error);
        const errorMessage: Message = {
          text: error instanceof Error ? error.message : 'An unknown error occurred.',
          sender: 'ai',
          timestamp: new Date(),
          status: 'error'
        };
        // Replace loading message with error
        setMessages(prev => prev.map((msg, idx) => 
          idx === prev.length - 1 ? errorMessage : msg
        ));
      } finally {
        setIsLoading(false);
      }
      return;
    } else {
      const newMessage: Message = {
        text: inputValue,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
      setIsLoading(true);

      // Add loading message
      const loadingMessage: Message = {
        text: 'Thinking...',
        sender: 'ai',
        timestamp: new Date(),
        status: 'loading'
      };
      setMessages(prev => [...prev, loadingMessage]);

      try {
        const documentText = await getSelectedOrFullText();
        const response = await fetch('https://localhost:5001/api/llm/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: inputValue,
            context: documentText || '',  // Ensure we always send a context, even if empty
            model_name: selectedModel,
            provider: 'openai'
          }),
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get response');
        }

        const data = await response.json();
        const aiResponse: Message = {
          text: data.response || data.text,
          sender: 'ai',
          timestamp: new Date(),
          status: 'success'
        };
        
        // Replace loading message with actual response
        setMessages(prev => prev.map((msg, idx) => 
          idx === prev.length - 1 ? aiResponse : msg
        ));
      } catch (error) {
        console.error('Chat error:', error);
        const errorMessage: Message = {
          text: error instanceof Error ? error.message : 'An unknown error occurred.',
          sender: 'ai',
          timestamp: new Date(),
          status: 'error'
        };
        // Replace loading message with error
        setMessages(prev => prev.map((msg, idx) => 
          idx === prev.length - 1 ? errorMessage : msg
        ));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getSelectedOrFullText = async (): Promise<string> => {
    try {
      let text = '';
      await Word.run(async (context) => {
        // First try to get selected text
        const selection = context.document.getSelection();
        selection.load('text');
        await context.sync();
        text = selection.text.trim();

        // If no text is selected, get the entire document
        if (!text) {
          const body = context.document.body;
          body.load('text');
          await context.sync();
          text = body.text.trim();
        }
      });
      return text;
    } catch (error) {
      console.error('Failed to get text:', error);
      throw new Error('Failed to get text from Word. Please try again.');
    }
  };

  const executeCommand = async (commandId: string) => {
    setInputValue('');
    setShowCommands(false);

    const command = commands.find(cmd => cmd.id === commandId);
    if (!command) return;

    const commandMessage: Message = {
      text: commandId === 'format' ? 
        `/${command.title}\nPlease specify your formatting preferences. For example:\n` +
        `- "Make paragraphs double-spaced"\n` +
        `- "Use bullet points for lists"\n` +
        `- "Capitalize headings"\n` +
        `- "Indent paragraphs"\n` +
        `- "Use consistent quotation marks"\n\n` +
        `What formatting would you like to apply?` :
        `/${command.title}`,
      sender: 'user',
      timestamp: new Date(),
      type: 'command'
    };
    setMessages(prev => [...prev, commandMessage]);

    if (commandId === 'format') {
      // For format command, wait for user input before proceeding
      return;
    }

    const loadingMessage: Message = {
      text: `Executing ${command.title.toLowerCase()}...`,
      sender: 'ai',
      timestamp: new Date(),
      status: 'loading'
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const text = await getSelectedOrFullText();
      // Only throw an error if text retrieval failed, not if document is empty
      if (text === undefined || text === null) {
        throw new Error('Failed to get text from the document. Please try again.');
      }

      let endpoint = '';
      switch (commandId) {
        case 'research':
          endpoint = '/api/llm/research';
          break;
        case 'summarize':
          endpoint = '/api/llm/summarize';
          break;
        case 'improve':
          endpoint = '/api/llm/improve';
          break;
        case 'format':
          endpoint = '/api/llm/format';
          break;
        default:
          throw new Error('Unknown command');
      }

      console.log(`Sending ${commandId} request for:`, text); // Debug log
      try {
        const response = await fetch(`https://localhost:5001${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            model_name: selectedModel,
            provider: 'openai',
            ...(commandId === 'research' && {
              search_depth: 'comprehensive',
              include_sources: true
            }),
            ...(commandId === 'improve' && {
              focus_areas: ['clarity', 'conciseness', 'grammar', 'style'],
              include_suggestions: true
            })
          }),
          credentials: 'include'
        });

        console.log('Response status:', response.status); // Debug log

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API error:', errorData); // Debug log
          throw new Error(errorData.error || `${command.title} request failed`);
        }

        const data = await response.json();
        console.log('Response data:', data); // Debug log

        const resultMessage: Message = {
          text: formatResponse(commandId, data),
          sender: 'ai',
          timestamp: new Date(),
          type: 'response',
          status: 'success',
          formattedText: data.formatted_text,
          formattedHtml: data.formatted_text_html,
          isHtml: true
        };
        setMessages(prev => prev.map((msg, idx) => 
          idx === prev.length - 1 ? resultMessage : msg
        ));
      } catch (error) {
        console.error('Request error:', error); // Debug log
        throw error;
      }
    } catch (error) {
      console.error('Command execution error:', error); // Debug log
      const errorMessage: Message = {
        text: error instanceof Error ? error.message : 'An unknown error occurred.',
        sender: 'ai',
        timestamp: new Date(),
        status: 'error'
      };
      setMessages(prev => prev.map((msg, idx) => 
        idx === prev.length - 1 ? errorMessage : msg
      ));
    }
  };

  // Helper function to format responses
  const formatResponse = (commandId: string, data: any): string => {
    try {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      console.log('Formatting response for command:', commandId, 'with data:', parsedData);
      
      switch (commandId) {
        case 'research':
          return `Research Results from GPT-4:\n\n` +
                 `Summary:\n${parsedData.summary}\n\n` +
                 `Sources:\n${parsedData.sources.map((source: any, index: number) => 
                   `${index + 1}. ${source.title}` +
                   `${source.url ? `\n   URL: ${source.url}` : ''}` +
                   `\n   ${source.description}` +
                   `\n   Relevance: ${source.relevance}\n`
                 ).join('\n')}`;
        
        case 'summarize':
          return `Summary from GPT-4:\n\n` +
                 `${parsedData.summary}\n\n` +
                 `Key Points:\n${parsedData.key_points.map((point: string, index: number) => 
                   `${index + 1}. ${point}`
                 ).join('\n')}\n\n` +
                 `Length Reduction: ${parsedData.length_reduction}`;
        
        case 'improve':
          return `Improved Text from GPT-4:\n\n` +
                 `${parsedData.improved_text}\n\n` +
                 `Changes Made:\n${parsedData.changes.map((change: string, index: number) => 
                   `${index + 1}. ${change}`
                 ).join('\n')}\n\n` +
                 `Additional Suggestions:\n${parsedData.suggestions.map((suggestion: string, index: number) => 
                   `${index + 1}. ${suggestion}`
                 ).join('\n')}`;

        case 'format':
          if (!parsedData.formatted_text) {
            console.error('Missing formatted text in response:', parsedData);
            throw new Error('Invalid format response: missing formatted text');
          }
          return `Preview of Formatted Text from GPT-4:\n` +
                 `----------------------------------------\n` +
                 `${parsedData.formatted_text}\n` +
                 `----------------------------------------\n\n` +
                 `Formatting Changes:\n${parsedData.changes?.map((change: string, index: number) => 
                   `${index + 1}. ${change}`
                 ).join('\n') || 'No changes required'}\n\n` +
                 `Style Guide:\n${parsedData.style_guide?.map((rule: string, index: number) => 
                   `${index + 1}. ${rule}`
                 ).join('\n')}`;
        default:
          throw new Error('Unknown command');
      }
    } catch (error) {
      console.error('Formatting error:', error);
      throw new Error('Failed to format response');
    }
  };

  return (
    <FluentProvider theme={isDarkTheme ? webDarkTheme : webLightTheme}>
      <div className={styles.root}>
        <Dropdown
          className={styles.dropdown}
          value={selectedModel}
          onOptionSelect={(_, data) => setSelectedModel(data.optionValue || 'gpt-4o')}
          appearance="filled-lighter"
        >
          {models.map(model => (
            <Option key={model.key} value={model.key}>
              {model.value}
            </Option>
          ))}
        </Dropdown>

        <div className={styles.quickActions}>
          {quickActions.map((action) => (
            <Tooltip key={action.id} content={action.label} relationship="label">
              <Button
                icon={action.icon}
                onClick={() => executeCommand(action.id)}
              />
            </Tooltip>
          ))}
        </div>

        <div className={styles.messages}>
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={styles.messageItem} 
              data-sender={message.sender}
              data-status={message.status}
            >
              <div className={styles.messageBubble}>
                {message.isHtml ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: message.text }}
                    style={message.type === 'response' ? {
                      backgroundColor: 'white',
                      padding: '1em',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      margin: '1em 0',
                      fontFamily: 'Arial, sans-serif'
                    } : undefined}
                  />
                ) : (
                  <span>{message.text}</span>
                )}
                {message.status === 'loading' && <span className={styles.loadingDots}>...</span>}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.input}>
          {showCommands && (
            <Menu open={showCommands}>
              <MenuPopover>
                <div className={styles.commandMenu}>
                  {Object.entries(
                    commands.reduce((acc, cmd) => {
                      acc[cmd.category] = [...(acc[cmd.category] || []), cmd];
                      return acc;
                    }, {} as Record<string, Command[]>)
                  ).map(([category, categoryCommands]) => (
                    <div key={category} className={styles.commandGroup}>
                      <h3>{category}</h3>
                      <MenuList>
                        {categoryCommands.map((cmd) => (
                          <MenuItem
                            key={cmd.id}
                            icon={cmd.icon}
                            onClick={() => executeCommand(cmd.id)}
                          >
                            <div>
                              <Text>{cmd.title}</Text>
                              <Text size={200} color="subtle">
                                {cmd.description}
                              </Text>
                            </div>
                          </MenuItem>
                        ))}
                      </MenuList>
                    </div>
                  ))}
                </div>
              </MenuPopover>
            </Menu>
          )}
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message or / for commands..."
            resize="none"
            disabled={isLoading}
          />
          <Button
            icon={<Send24Regular />}
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
          />
        </div>
      </div>
    </FluentProvider>
  );
}