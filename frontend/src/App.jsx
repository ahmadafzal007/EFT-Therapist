import { ChatInterface } from "./components/ChatInterface"
import { ChatProvider } from "./context/ChatContext"
import { ThemeProvider } from "./components/ThemeProvider"

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <main className="min-h-screen bg-gray-900 text-white">
          <ChatInterface />
        </main>
      </ChatProvider>
    </ThemeProvider>
  )
}

export default App

