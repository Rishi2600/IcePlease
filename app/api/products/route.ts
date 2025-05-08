import { NextRequest, NextResponse } from "next/server"

export async function POST (req: NextRequest, res: NextResponse) {
    try {
        const {username, password} = await req.json()
        
        console.log(username, password)

        return NextResponse.json({
            username: username,
            password: password
        }, {
            status: 200
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
            message: "Hi there"
        }, {
            status: 200
        })
    } catch(e) {
        console.log(e)

        return NextResponse.json({
            message: "cannot GET"
        }, {
            status: 404
        })
    }

}