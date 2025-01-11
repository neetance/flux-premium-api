import axios from 'axios';
import { Request, Response } from 'express';
import { exp, log, sqrt, norm } from 'mathjs'
import * as ss from 'simple-statistics';

const getPremium = async(req: Request, res: Response) => {
    try {
        const { currentPrice, strikePrice, timeToExpiration } = req.query;
        const tokenAddress = req.query.tokenAddress;
        const volRes = await axios.get(`https://cryptocurrency-stats.onrender.com/api/deviation?coin=${tokenAddress}`);
        const volatility = volRes.data.volatility;
        const riskFreeRate = 0.05; 

        const {callPremium, putPremium} = blackScholesPremium(Number(currentPrice), Number(strikePrice), timeToExpiration, riskFreeRate, volatility);
        res.status(200).json({ callPremium, putPremium });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

function blackScholesPremium(
    S: number, 
    K: number, 
    T: any, 
    r: number, 
    sigma: number 
): { callPremium: number, putPremium: number } {
    const sigmaValue = Number(sigma);
    const TValue = Number(T) as any;

    if (isNaN(sigmaValue) || isNaN(TValue)) {
        throw new Error("Invalid input for sigma or T");
    }

    const d1 = (log(S / K) + (r + 0.5 * sigmaValue ** 2) * TValue) / (sigmaValue * sqrt(TValue));
    const d2 = d1 - sigmaValue * sqrt(TValue);

    const callPremium = S * ss.probit(d1) - K * exp(-r * TValue) * ss.probit(d2);

    const putPremium = K * exp(-r * TValue) * ss.probit(-d2) - S * ss.probit(-d1);

    return { callPremium, putPremium };
}

export default getPremium;
