import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const App = () => {
  return (
    <div>
      <h1>home page</h1>

      <div>
        <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      </div>
    </div>
  )
}

export default App
