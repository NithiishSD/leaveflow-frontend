import apiClient from "../api.js";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import HeaderBar from "./HeaderBar.jsx";  
import { useParams } from "react-router-dom";

const leaveTypes = [
  { label: "Annual Leave", value: "VACATION" },
  { label: "Sick Leave", value: "SICK" },
  { label: "Casual Leave", value: "CASUAL" },
  { label: "Maternity / Paternity Leave", value: "MATERNITY" },
  { label: "Unpaid Leave", value: "UNPAID" },
  { label: "Compensatory Leave", value: "COMPENSATORY" },
];
const INITIAL_MY_REQUESTS = [
  { reqId: "REQ001", type: "Annual Leave",       start: "2026-01-06", end: "2026-01-10", days: 5,  status: "approved", reason: "Family vacation"         },
  { reqId: "REQ002", type: "Sick Leave",         start: "2026-01-20", end: "2026-01-21", days: 2,  status: "approved", reason: "Fever & rest"             },
  { reqId: "REQ003", type: "Casual Leave",       start: "2026-02-14", end: "2026-02-14", days: 1,  status: "rejected", reason: "Personal errand"          },
  { reqId: "REQ004", type: "Annual Leave",       start: "2026-02-25", end: "2026-03-01", days: 5,  status: "approved", reason: "Travel"                   },
  { reqId: "REQ005", type: "Sick Leave",         start: "2026-03-05", end: "2026-03-05", days: 1,  status: "returned", reason: "Medical appointment"      },
  { reqId: "REQ006", type: "Casual Leave",       start: "2026-03-18", end: "2026-03-19", days: 2,  status: "pending",  reason: "Home renovation"          },
  { reqId: "REQ007", type: "Annual Leave",       start: "2026-04-10", end: "2026-04-15", days: 6,  status: "pending",  reason: "Vacation"                 },
  { reqId: "REQ008", type: "Maternity Leave",    start: "2026-05-01", end: "2026-07-29", days: 90, status: "pending",  reason: "Maternity"                },
  { reqId: "REQ009", type: "Sick Leave",         start: "2026-01-12", end: "2026-01-12", days: 1,  status: "approved", reason: "Doctor visit"             },
  { reqId: "REQ010", type: "Casual Leave",       start: "2026-02-03", end: "2026-02-03", days: 1,  status: "approved", reason: "Personal work"            },
  { reqId: "REQ011", type: "Annual Leave",       start: "2026-03-28", end: "2026-03-29", days: 2,  status: "rejected", reason: "Weekend extension"        },
  { reqId: "REQ012", type: "Compensatory Leave", start: "2026-04-22", end: "2026-04-22", days: 1,  status: "returned", reason: "Comp off for extra work"  },
];
export default function RequestForm() {
  const {id}=useParams()
  const [isedit, setIsEdit] = useState(Boolean(id));
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [fileNames, setFileNames] = useState([]);
  const [files, setFiles] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [signature, setSignature] = useState("");
  const [signatureFile, setSignatureFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
 
  
    
    useEffect(() => {
      const fetchRequestData = async () => {
        try {
          const response = await apiClient.get(`/requests/${id}`,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
          if (response.status === 200) {
            const data = response.data;
            setLeaveType(data.leaveType);
            setStartDate(data.startDate);
            setEndDate(data.endDate);
            setReason(data.reason);
            setFileNames(Array.isArray(data.fileNames) ? data.fileNames : data.fileName ? [data.fileName] : []);
            setConfirmed(data.confirmed);
            setSignature(data.signature);
          } else {
            setErrors({ form: "Failed to load request data. Please try again." });
          }
        } catch (error) {
          setErrors({ form: "Failed to load request data. Please try again." });
        }
      };

      if (isedit) {
        const data=INITIAL_MY_REQUESTS.filter(r=>r.reqId===id)[0]  // Replace with actual API call when backend is ready
        setLeaveType(data.type);
            setStartDate(data.start);
            setEndDate(data.end);
            setReason(data.reason);
            setFileNames(Array.isArray(data.fileNames) ? data.fileNames : data.fileName ? [data.fileName] : []);
            setConfirmed(data.confirmed);
            setSignature(data.signature);
        fetchRequestData();
      }
    }, [id]);


  const validate = () => {
    const newErrors = {};
    if (!leaveType) newErrors.leaveType = "Please select a leave type.";
    if (!startDate) newErrors.startDate = "Start date is required.";
    if (!endDate) newErrors.endDate = "End date is required.";
    if (startDate && endDate && endDate < startDate)
      newErrors.endDate = "End date must be after start date.";
    if (!reason.trim()) newErrors.reason = "Please provide a reason.";
    if (!confirmed) newErrors.confirmed = "You must confirm the declaration.";
    if (!signature.trim()) newErrors.signature = "Signature is required.";
    return newErrors;
  };
 
  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors({});
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    if (!isedit) {
      try {
        // Create FormData for multipart file upload
        const formData = new FormData();
        formData.append('type', leaveType);
        formData.append('start_date', startDate);
        formData.append('end_date', endDate);
        formData.append('reason', reason);
        
        // Add document files if any
        files.forEach((file) => {
          formData.append('documentFile', file);
        });
        
        // Add signature file if EMERGENCY leave
        if (leaveType === 'EMERGENCY' && signatureFile) {
          formData.append('signatureFile', signatureFile);
        }

        const response = await apiClient.post("/requests", formData, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.status === 200 || response.status === 201) {
          setSubmitted(true);
        } else {
          setErrors({ form: "Failed to submit request. Please try again." });
        }
      } catch (error) {
        console.error('Error submitting request:', error);
        setErrors({ form: error.response?.data?.message || "Failed to submit request. Please try again." });
      }
    } else {
      try {
        // For update, also use FormData to handle file changes
        const formData = new FormData();
        formData.append('type', leaveType);
        formData.append('start_date', startDate);
        formData.append('end_date', endDate);
        formData.append('reason', reason);
        
        // Add new document files if any
        files.forEach((file) => {
          formData.append('documentFile', file);
        });
        
        // Add signature file if provided
        if (signatureFile) {
          formData.append('signatureFile', signatureFile);
        }

        const response = await apiClient.put(`/requests/${id}`, formData, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.status === 200) {
          setSubmitted(true);
        } else {
          setErrors({ form: "Failed to update request. Please try again." });
        }
      } catch (error) {
        console.error('Error updating request:', error);
        setErrors({ form: error.response?.data?.message || "Failed to update request. Please try again." });
      }
    }
  };
 
  const handleReset = () => {
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setReason("");
    setFileNames([]);
    setFiles([]);
    setConfirmed(false);
    setSignature("");
    setSignatureFile(null);
    setErrors({});
    setSubmitted(false);
  };
 
  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 font-['Roboto:Medium',sans-serif]">
        <div className="bg-white border border-stone-200 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-stone-800 mb-2 tracking-[0.1px]">Request Submitted</h2>
          <p className="text-stone-500 text-sm mb-6 font-medium tracking-[0.1px]">
            Your leave request has been received and is pending approval.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors tracking-[0.1px]"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }
 
  return (
   
    <div className="flex min-h-screen bg-[#e0e0e0] font-['Roboto:Medium',sans-serif] gap-4 flex-col md:flex-row">
    <Sidebar name = 'requests'/>
    
    <main className="flex-1 bg-[#e0e0e0] shadow-sm px-10 py-4 md:px-12 overflow-y-auto gap-3">
      <HeaderBar title="Leave Request Form" />
            <div className=" bg-white p-6 rounded-2xl flex flex-col gap-6">
            {/* Leave Type */}
            <div>
              <label className="block text-xs font-semibold tracking-[0.1px] text-stone-500 uppercase mb-2">
                Leave Type
              </label>
              <div className="relative">
                <select
                  value={leaveType}
                  onChange={(e) => {
                    setLeaveType(e.target.value);
                    setErrors((prev) => ({ ...prev, leaveType: undefined }));
                  }}
                  className={`w-full appearance-none bg-stone-50 border rounded-xl px-4 py-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition ${
                    errors.leaveType ? "border-red-300 bg-red-50" : "border-stone-200"
                  }`}
                >
                  <option value="" disabled>Select Leave Type</option>
                  {leaveTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.leaveType && <p className="text-xs text-red-500 mt-1">{errors.leaveType}</p>}
            </div>
 
            {/* Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold tracking-[0.1px] text-stone-500 uppercase mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setErrors((prev) => ({ ...prev, startDate: undefined }));
                  }}
                  className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition ${
                    errors.startDate ? "border-red-300 bg-red-50" : "border-stone-200"
                  }`}
                />
                {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-[0.1px] text-stone-500 uppercase mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setErrors((prev) => ({ ...prev, endDate: undefined }));
                  }}
                  className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition ${
                    errors.endDate ? "border-red-300 bg-red-50" : "border-stone-200"
                  }`}
                />
                {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
              </div>
            </div>
 
            {/* Reason */}
            <div>
              <label className="block text-xs font-semibold tracking-[0.1px] text-stone-500 uppercase mb-2">
                Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setErrors((prev) => ({ ...prev, reason: undefined }));
                }}
                placeholder="Please provide a detailed description for your leave..."
                rows={4}
                className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-400 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition ${
                  errors.reason ? "border-red-300 bg-red-50" : "border-stone-200"
                }`}
              />
              {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason}</p>}
            </div>
 
            {/* Supporting Documents */}
            <div>
              <label className="block text-xs font-semibold tracking-[0.1px] text-stone-500 uppercase mb-2">
                Supporting Documents
              </label>
              <label className="flex items-center gap-3 bg-stone-50 border border-stone-200 border-dashed rounded-xl px-4 py-4 cursor-pointer hover:bg-stone-100 transition">
  <div className="w-8 h-8 bg-stone-200 rounded-lg flex items-center justify-center shrink-0">
    <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  </div>
  <div className="flex-1 min-w-0">
    {fileNames && fileNames.length > 0 ? (
      <ul className="text-sm text-stone-700">
        {fileNames.map((name, idx) => (
          <li key={idx} className="truncate">{name}</li>
        ))}
      </ul>
    ) : (
      <>
        <p className="text-sm text-stone-500">Click to upload documents</p>
        <p className="text-xs text-stone-400">PDF, PNG, JPG up to 10MB</p>
      </>
    )}
  </div>
  <input
    type="file"
    className="hidden"
    multiple
    onChange={(e) => {
      const fileList = Array.from(e.target.files || []);
      setFileNames(fileList.map(f => f.name));
      setFiles(fileList);
    }}
  />
        </label>
            </div>
 
          {/* Digital Signature Section */}
          <div className="border-t border-stone-100 bg-stone-50 px-8 py-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <h3 className="text-sm font-semibold text-stone-700 tracking-[0.1px]">Digital Signature</h3>
            </div>
 
            {/* Confirmation Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => {
                    setConfirmed(e.target.checked);
                    setErrors((prev) => ({ ...prev, confirmed: undefined }));
                  }}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
                  confirmed
                    ? "bg-emerald-500 border-emerald-500"
                    : errors.confirmed
                    ? "border-red-400 bg-red-50"
                    : "border-stone-300 group-hover:border-stone-400"
                }`}>
                  {confirmed && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-stone-600 leading-snug">
                I confirm that all information provided in this leave request is accurate and complete.
              </span>
            </label>
            {errors.confirmed && <p className="text-xs text-red-500 -mt-3">{errors.confirmed}</p>}
 
            {/* Signature Input */}
            <div>
              <label className="block text-xs font-semibold tracking-[0.1px] text-stone-500 uppercase mb-2">
                Full Name as Signature
              </label>
              <input
                type="text"
                value={signature}
                onChange={(e) => {
                  setSignature(e.target.value);
                  setErrors((prev) => ({ ...prev, signature: undefined }));
                }}
                placeholder="Type your full name"
                className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-stone-800 font-medium placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition italic ${
                  errors.signature ? "border-red-300 bg-red-50" : "border-stone-200"
                }`}
                style={{ fontFamily: "Georgia, serif" }}
              />
              {errors.signature && <p className="text-xs text-red-500 mt-1">{errors.signature}</p>}
            </div>

            {/* Signature File Upload (for EMERGENCY requests) */}
            <div>
              <label className="block text-xs font-semibold tracking-[0.1px] text-stone-500 uppercase mb-2">
                Digital Signature File (for Emergency Leave)
              </label>
              <label className="flex items-center gap-3 bg-stone-50 border border-stone-200 border-dashed rounded-xl px-4 py-4 cursor-pointer hover:bg-stone-100 transition">
                <div className="w-8 h-8 bg-stone-200 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  {signatureFile ? (
                    <p className="text-sm text-stone-700">{signatureFile.name}</p>
                  ) : (
                    <>
                      <p className="text-sm text-stone-500">Click to upload signature</p>
                      <p className="text-xs text-stone-400">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setSignatureFile(file || null);
                  }}
                />
              </label>
            </div>
          </div>
 
          {/* Action Buttons */}
          <div className="border-t border-stone-100 px-8 py-5 flex items-center gap-3 bg-white">
            <button
              onClick={handleSubmit}
              className="px-7 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all"
            >
              Submit Request
            </button>
            <button
              onClick={handleReset}
              className="px-7 py-2.5 bg-stone-100 text-stone-600 text-sm font-medium rounded-xl hover:bg-stone-200 active:scale-95 transition-all"
            >
              Reset
            </button>
          </div>
        </div>
 
        
     
     </main>
      </div>
  );
}
