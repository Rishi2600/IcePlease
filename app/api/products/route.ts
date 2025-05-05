import { NextRequest, NextResponse } from "next/server"

export async function POST (req: NextRequest, res: NextResponse) {
    try {
        const username = await req.json()
        const password = await req.json()
        
        console.log(username, password)

        return NextResponse.json({
            username: username,
            password: password
        })
    } catch(e) {
        console.log(e)

        return NextResponse.json({
            message: "Request cannot be processed"
        }, {
            status: 404
        })
    }
}

export async function GET() {
    try {
        return NextResponse.json({
            message: "hey therre"
        })
    } catch(e) {
        console.log(e)
    }

}