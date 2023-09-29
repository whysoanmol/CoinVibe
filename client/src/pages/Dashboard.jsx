import { useEffect, useState } from "react"
import axios from "axios"
import { CoinList } from "../config/api"
import { useNavigate } from "react-router-dom"



export default function Dashboard() {
    const [coins, setCoins] = useState([])
    const [loading, setLoading] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false)
    // const navigate = useNavigate()

    const getCoins = async () => {
        setLoading(true)
        const { data } = await axios.get(CoinList("INR"))
        setCoins(data)
        setLoading(false)
    }

    useEffect(() => {
        getCoins()
    }, [])

    // useEffect(() => {
    //     let interval = setInterval(() => {
    //         getCoins()
    //     }, 60000)

    //     return () => {
    //         clearInterval(interval)
    //     }
    // }, [])

    const currencyFormatter = (num) => {
        const formattedCurrency = num.toLocaleString('en-US',{
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        })
        return formattedCurrency
    }

    return (
        <div className='mt-4 flex flex-col'>
            <div className='px-4 py-2 max-w-xs bg-[#191A23] rounded flex items-center self-end'>
                <span className="material-symbols-outlined">search</span>
                <input type="text" placeholder='Search' className='ml-2 bg-transparent outline-none' />
            </div>

            <table className='mt-4 table-auto text-left'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Current Price</th>
                        <th>Market Cap</th>
                    </tr>
                </thead>
                <tbody>
                    {coins.map((coin) => (
                        <tr key={coin.id} onClick={() => {console.log(coin)}} className="cursor-pointer">
                            <td>
                                <div className="flex space-x-4 items-center py-4">
                                    <img src={coin.image} alt={coin.name} className="w-8 bg-white rounded-full" />
                                    <div>
                                        <p>{coin.name}</p>
                                        <p className="text-gray-400">{coin.symbol.toUpperCase()}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <p>{currencyFormatter(coin.current_price)}</p>
                                {
                                    coin.price_change_percentage_24h < 0 ? (
                                        <p className="text-red-600">{coin.price_change_percentage_24h.toFixed(2)}%</p>
                                    ):(
                                        <p className="text-green-600">{coin.price_change_percentage_24h.toFixed(2)}%</p>
                                    )
                                }
                            </td>
                            <td>{currencyFormatter(coin.market_cap)}</td>
                            {
                                loggedIn && (
                                    <td><button className="px-2 py-1 rounded border border-[#191A23]">Track</button></td>
                                )
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
