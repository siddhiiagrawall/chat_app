import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import IconBar from "../components/IconBar";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, updateAbout } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [about, setAbout] = useState(authUser.about || "");
  const [isEditingAbout, setIsEditingAbout] = useState(false);

  const handleUpdateAbout = async () => {
    await updateAbout({ about });
    setIsEditingAbout(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="h-screen bg-slate-900 flex overflow-hidden">
      <IconBar />
      <div className="flex-1 overflow-y-auto bg-slate-800">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-slate-900 rounded-xl p-6 space-y-8 border border-slate-700">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-slate-50">Profile</h1>
              <p className="mt-2 text-slate-400">Your profile information</p>
            </div>

            {/* avatar upload section */}

            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 border-slate-700"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                  absolute bottom-0 right-0 
                  bg-green-500 hover:bg-green-600 hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
                >
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-slate-400">
                {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-slate-800 rounded-lg border border-slate-700 text-slate-50">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                About
              </div>
              <div className="relative">
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 rounded-lg border border-slate-700 text-slate-50 focus:border-green-500 focus:outline-none resize-none"
                  rows="3"
                  disabled={!isEditingAbout}
                />
                {!isEditingAbout ? (
                  <button
                    onClick={() => setIsEditingAbout(true)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-green-500 transition-colors"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <button
                      onClick={() => {
                        setAbout(authUser.about || "");
                        setIsEditingAbout(false);
                      }}
                      className="px-3 py-1 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateAbout}
                      disabled={isUpdatingProfile}
                      className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {isUpdatingProfile ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-slate-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-slate-800 rounded-lg border border-slate-700 text-slate-50">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-medium text-slate-50 mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-slate-700">
                <span className="text-slate-400">Member Since</span>
                <span className="text-slate-50">{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400">Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};
export default ProfilePage;