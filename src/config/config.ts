import { Abi, Address } from "viem";

import { createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'

const WagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http()
  },
})

const address:Address= "0xBDDe05d3E05F87Fc6c92A1fd47dA0e479cB25D7C"
const abi:Abi = [
	
]


// ...
export{
    abi,
    address,
	WagmiConfig
}