"use client";
import React, { useState, useEffect } from 'react';
import {
    Bell,
    Clock,
    ChevronRight,
    Filter,
    RefreshCcw,
    AlertCircle,
} from 'lucide-react';

interface Activity {
    id: string;
    type: string;
    title: string;
    message: string;
    timeAgo: string;
    icon: string;
    priority: 'high' | 'medium' | 'low';
    user?: string;
    amount?: number;
    location?: string;
    phone?: string;
}

export default function NotificationsPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchActivities = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/admin/recent-activities?limit=20', {
                headers: {
                    'x-api-key': '9a4f2c8d7e1b5f3a9c2d8e7f1b4a5c3d'
                }
            });
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            if (data.success) {
                setActivities(data.activities);
            }
        } catch (err) {
            setError('Could not load your activities. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
            case 'medium': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
            default: return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Bell className="w-6 h-6 text-blue-600" />
                        Activities & Notifications
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Monitor all system actions and frame updates in one place.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchActivities}
                        className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                        title="Refresh"
                    >
                        <RefreshCcw className={`w-5 h-5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden">
                {loading && !activities.length ? (
                    <div className="p-20 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading your activity history...</p>
                    </div>
                ) : error ? (
                    <div className="p-20 text-center">
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full inline-flex mb-4 text-red-500">
                            <AlertCircle className="w-10 h-10" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">{error}</p>
                        <button
                            onClick={fetchActivities}
                            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="p-20 flex flex-col items-center text-center">
                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-full mb-6 text-gray-400">
                            <Clock className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No activity logged yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                            As soon as users start framing photos or admins update layouts, logs will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {activities.map((activity) => (
                            <div
                                key={activity.id}
                                className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                            >
                                <div className="flex gap-4">
                                    <div className={`p-3 rounded-2xl flex-shrink-0 ${getPriorityColor(activity.priority)}`}>
                                        <Bell className="w-6 h-6" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                                {activity.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <Clock className="w-3 h-3" />
                                                {activity.timeAgo}
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                                            {activity.message}
                                        </p>

                                        <div className="flex items-center gap-3">
                                            <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg text-xs font-black uppercase tracking-wider">
                                                {activity.type.replace('_', ' ')}
                                            </span>
                                            {activity.priority === 'high' && (
                                                <span className="flex items-center gap-1 text-red-500 text-xs font-bold">
                                                    <AlertCircle className="w-3 h-3" />
                                                    High Priority
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight className="w-5 h-5 text-gray-300" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && activities.length > 0 && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 text-center border-t border-gray-100 dark:border-gray-800">
                        <span className="text-xs text-gray-400 font-medium">
                            Showing the latest {activities.length} activity logs
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
