export interface matchInfo{
	name: string
	p1Id: string
	p2Id?: string
	p1Elo: number
	p2Elo?: number
	winnerId: number
	p1Score: number
	p2Score: number
	p1EloGain: number
	p2EloGain: number
	mDate: number
	matchType: string
}
