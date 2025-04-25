import { ConnectButton } from '@rainbow-me/rainbowkit'

const WalletConnect = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to TodoDApp</h1>
          <p className="text-gray-600 mb-8">Connect your wallet to start managing your tasks</p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletConnect 