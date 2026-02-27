import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '8');

        // Check API Key
        const apiKey = request.headers.get('x-api-key');
        const validApiKey = process.env.NEXT_PUBLIC_API_KEY || '9a4f2c8d7e1b5f3a9c2d8e7f1b4a5c3d';

        if (apiKey !== validApiKey) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized: Invalid API Key'
            }, { status: 401 });
        }

        // Mock activities
        const activities = [
            {
                id: '1',
                type: 'frame_creation',
                title: 'New Frame Created',
                message: 'Admin created a new "Wedding Floral" frame layout.',
                timeAgo: '2 hours ago',
                icon: 'star',
                priority: 'medium'
            },
            {
                id: '2',
                type: 'system_update',
                title: 'System Optimization',
                message: 'Canvas rendering engine was updated to support multi-text areas.',
                timeAgo: '5 hours ago',
                icon: 'notification',
                priority: 'low'
            },
            {
                id: '3',
                type: 'security_alert',
                title: 'New Admin Login',
                message: 'A new administrative session was started from a new IP address.',
                timeAgo: '1 day ago',
                icon: 'notification',
                priority: 'high'
            },
            {
                id: '4',
                type: 'frame_usage',
                title: 'Popular Frame',
                message: 'The "Eid Special" frame reached 100 uses today.',
                timeAgo: '1 day ago',
                icon: 'star',
                priority: 'medium'
            }
        ].slice(0, limit);

        return NextResponse.json({
            success: true,
            activities,
            message: 'Activities fetched successfully'
        });
    } catch (error) {
        console.error('Error in recent-activities API:', error);
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error',
            activities: []
        }, { status: 500 });
    }
}
