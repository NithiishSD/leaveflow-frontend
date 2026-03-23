import React from 'react'
import {useLeave} from '../components/LeaveContext.jsx'
import Sidebar from '../components/Sidebar.jsx'
import HeaderBar from '../components/HeaderBar.jsx'

export default function RequestHistory(){
    const {stats,requests,loading} = useLeave()
    return (
        <div className = "flex min-h-screen bg-[#e0e0e0] font-['Roboto:Medium',sans-serif] gap-4 flex-col md:flex-row">
            <Sidebar name = 'requests-received'/>
            <main className="flex-1 px-4 md:px-6 py-4 md:py-6 overflow-y-auto">
                <HeaderBar title="Leave Request History" />
                
                <section className="mt-6 bg-white rounded-2xl shadow-sm p-8 mb-6">
                    <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 tracking-[0.1px]">Your Request History</h2>
                    
                    <div className="flex gap-4">
                        <div className="relative">
                        <button className="flex items-center justify-between w-40 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium tracking-[0.1px]">
                            <span>Leave Status</span>
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        </div>
                        
                        <div className="relative">
                        <button className="flex items-center justify-between w-40 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium tracking-[0.1px]">
                            <span>Leave type</span>
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        </div>
                    </div>
                    </div>

                    <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-purple-50/50">
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 tracking-[0.1px]">Leave Type</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 tracking-[0.1px]">Dates Requested</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 tracking-[0.1px]">Reason</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 tracking-[0.1px]">Submitted On</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 tracking-[0.1px]">Status</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 tracking-[0.1px]">Assigned To</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 tracking-[0.1px]"></th> </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-600 font-medium tracking-[0.1px]"></td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-medium tracking-[0.1px]"></td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-medium tracking-[0.1px]"></td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-medium tracking-[0.1px]"></td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-medium tracking-[0.1px]"></td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-medium tracking-[0.1px]"></td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-purple-600 hover:text-purple-900 px-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </section>
            </main>
        </div>
    )
}