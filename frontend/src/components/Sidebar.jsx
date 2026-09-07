import React, { useEffect, useState } from "react";
import {
  Coins,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftIcon,
  PanelRight,
  PenSquare,
  Plus,
  User,
  X,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { getConversations } from "../features/getConversations";
import {
  addConversation,
  selectConversation,
  setConversation,
} from "../redux/conversation.slice.js";
import { createConversation } from "../features/createConversation";
import logOut from "../features/logOut.js";
import { setUserdata } from "../redux/userSlice.js";

import BillingDrawer from "./BillingDrawer.jsx";

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showBilling, setShowBilling] = useState(false);

  const dispatch = useDispatch();

  const { conversations, selectedConversaton } = useSelector(
    (state) => state.conversation
  );

  const { userData } = useSelector((state) => state.user);

  // Fetch conversations
  useEffect(() => {
    const getConv = async () => {
      try {
        const data = await getConversations();
        dispatch(setConversation(data));
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };

    getConv();
  }, [userData?._id, dispatch]);

  // Create new conversation
  const handleCreateConversation = async () => {
    try {
      const data = await createConversation();
      dispatch(addConversation(data));
      dispatch(selectConversation(data));
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  // Select conversation
  const handleSelectConversation = (conversation) => {
    dispatch(selectConversation(conversation));
    setIsMobile(false);
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logOut();
      dispatch(setUserdata(null));
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // User avatar
  const UserAvatar = ({ size = "normal" }) => {
    const sizeClass = size === "small" ? "w-9 h-9" : "w-9 h-9";

    if (userData?.avatar && !imageError) {
      return (
        <img
          src={userData.avatar}
          alt="Profile"
          onError={() => setImageError(true)}
          className={`${sizeClass} rounded-[10px] object-cover border-2 border-indigo-500/25`}
        />
      );
    }

    return (
      <div
        className={`${sizeClass} flex items-center justify-center rounded-[10px] bg-white/6`}
      >
        <User size={18} className="text-slate-400" />
      </div>
    );
  };

  // Conversation list
  const ConversationList = ({ collapsedView = false }) => {
    return (
      <div
        className={`flex-1 overflow-y-auto ${
          collapsedView
            ? "px-2.5 pb-2 pt-10 scrollbar-none [&::-webkit-scrollbar]:hidden"
            : "px-2.5 pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden"
        }`}
      >
        {conversations?.map((conv) => {
          const isActive = selectedConversaton?._id === conv?._id;

          return (
            <div
              key={conv._id}
              onClick={() => handleSelectConversation(conv)}
              className={`
                flex items-center gap-2.5
                cursor-pointer mb-0.5
                px-3 py-2.5
                rounded-[10px]
                border
                transition-colors duration-150
                ${
                  isActive
                    ? "bg-indigo-500/10 border-indigo-500/18"
                    : "bg-transparent border-transparent"
                }
              `}
            >
              <div
                className={`
                  flex items-center justify-center
                  shrink-0 w-7 h-7
                  rounded-lg
                  transition-colors duration-150
                  ${
                    isActive
                      ? "bg-indigo-500/15 text-indigo-400"
                      : "bg-white/5 text-slate-500"
                  }
                `}
              >
                <MessageSquare size={13} />
              </div>

              {!collapsedView && (
                <span
                  className={`
                    text-[13px] font-medium truncate
                    ${
                      isActive
                        ? "text-slate-100"
                        : "text-slate-300"
                    }
                  `}
                >
                  {conv?.title || "New Chat"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* =====================================================
          MOBILE MENU BUTTON
      ====================================================== */}

      <button
        className="
          lg:hidden
          fixed top-3.5 left-4
          z-60
          flex items-center justify-center
          w-8 h-8
          rounded-lg
          bg-[#0d0f14]
          border border-white/6
          text-slate-400
          hover:text-slate-200
          transition-colors
          cursor-pointer
        "
        onClick={() => setIsMobile(true)}
      >
        <Menu size={14} />
      </button>

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {isMobile && (
        <div
          className="
            lg:hidden
            fixed inset-0
            z-40
            bg-black/50
            backdrop-blur-sm
          "
          onClick={() => setIsMobile(false)}
        />
      )}

      {/* =====================================================
          MOBILE SIDEBAR
      ====================================================== */}

      <div
        className={`
          lg:hidden
          fixed inset-y-0 left-0
          z-50
          w-67.5
          h-screen
          bg-[#0d0f14]
          border-r border-white/6
          transition-transform duration-200
          ${
            isMobile
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile header */}

          <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/6">
            <button
              className="
                flex items-center justify-center
                w-7 h-7
                rounded-lg
                text-slate-500
                hover:text-slate-200
                hover:bg-white/5
                transition-colors
                cursor-pointer
              "
              onClick={() => setIsMobile(false)}
            >
              <X size={18} />
            </button>

            <span className="text-[16px] font-semibold text-slate-100 tracking-tight flex-1">
              CortexAI
            </span>

            <span
              className="
                text-[10px]
                font-medium
                text-indigo-400
                bg-indigo-500/10
                border border-indigo-500/20
                px-2 py-0.5
                rounded-full
                tracking-wide
              "
            >
              {userData?.plan || "free"}
            </span>

            <button
              className="
                flex items-center justify-center
                w-7 h-7
                rounded-lg
                text-slate-500
                hover:text-slate-200
                hover:bg-white/5
                transition-colors
                cursor-pointer
              "
              onClick={handleCreateConversation}
            >
              <PenSquare size={14} />
            </button>
          </div>

          {/* New chat */}

          <div className="px-4 pt-4 pb-1">
            <button
              onClick={handleCreateConversation}
              className="
                w-full
                flex items-center justify-center gap-2
                text-sm font-medium
                text-white
                bg-linear-to-br from-indigo-500 to-violet-700
                rounded-xl
                py-2.5
                cursor-pointer
                hover:opacity-90
                transition-opacity
              "
            >
              <Plus size={15} />
              New Chat
            </button>
          </div>

          {/* Recents */}

          <div
            className="
              px-5 pt-4 pb-1.5
              text-[10.5px]
              font-semibold
              uppercase
              tracking-widest
              text-slate-600
            "
          >
            {conversations?.length === 0
              ? "No recent conversations"
              : "Recents"}
          </div>

          <ConversationList />

          {/* Footer */}

          <div className="mx-2.5 h-px bg-white/6" />

          <div className="px-3.5 py-3.5">
            {userData ? (
              <div
                className="
                  flex items-center gap-2.5
                  rounded-xl
                  px-3 py-2.5
                  hover:bg-white/5
                  transition-colors
                "
              >
                <div className="relative shrink-0">
                  <UserAvatar />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-slate-100 truncate">
                    {userData?.name || "User"}
                  </p>

                  <p className="text-[11px] text-slate-600 mt-1">
                    {userData?.plan || "free"}
                  </p>
                </div>

                <div className="flex gap-1">
                  <button
                    className="
                      flex items-center justify-center
                      w-7 h-7
                      rounded-[7px]
                      bg-transparent
                      text-yellow-600
                      cursor-pointer
                      hover:bg-white/8
                      hover:text-yellow-400
                      transition-all
                    "
                    onClick={() => setShowBilling(true)}
                  >
                    <Coins size={16} />
                  </button>

                  <button
                    className="
                      flex items-center justify-center
                      w-7 h-7
                      rounded-[7px]
                      bg-transparent
                      text-slate-600
                      cursor-pointer
                      hover:bg-white/8
                      hover:text-slate-400
                      transition-all
                    "
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="
                  w-full
                  flex items-center justify-center gap-2
                  text-sm font-medium
                  text-slate-200
                  bg-white/5
                  border border-white/8
                  rounded-xl
                  py-2.5
                  cursor-pointer
                  hover:bg-white/8
                  transition-colors
                "
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <div
        className={`
          hidden lg:flex
          flex-col
          h-screen
          shrink-0
          bg-[#0d0f14]
          border-r border-white/6
          transition-all duration-200
          ${
            collapsed
              ? "w-14"
              : "w-67.5"
          }
        `}
      >
        {collapsed ? (
          /* =================================================
             COLLAPSED DESKTOP SIDEBAR
          ================================================== */

          <>
            {/* Expand */}

            <button
              className="
                flex items-center justify-center
                w-9 h-9
                mx-auto mt-4
                rounded-xl
                text-slate-500
                hover:text-slate-200
                hover:bg-white/5
                transition-colors
                cursor-pointer
              "
              onClick={() => setCollapsed(false)}
            >
              <PanelRight size={18} />
            </button>

            {/* New conversation */}

            <button
              className="
                flex items-center justify-center
                w-9 h-9
                mx-auto mt-1
                rounded-xl
                text-slate-500
                hover:text-slate-200
                hover:bg-white/5
                transition-colors
                cursor-pointer
              "
              onClick={handleCreateConversation}
            >
              <Plus size={17} />
            </button>

            {/* Conversations */}

            <ConversationList collapsedView />

            {/* Avatar */}

            <div className="shrink-0 flex justify-center pb-4">
              <UserAvatar size="small" />
            </div>
          </>
        ) : (
          /* =================================================
             EXPANDED DESKTOP SIDEBAR
          ================================================== */

          <div className="flex flex-col h-full">
            {/* Header */}

            <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/6">
              <button
                className="
                  flex items-center justify-center
                  w-7 h-7
                  rounded-lg
                  text-slate-500
                  hover:text-slate-200
                  hover:bg-white/5
                  transition-colors
                  cursor-pointer
                "
                onClick={() => setCollapsed(true)}
              >
                <PanelLeftIcon size={18} />
              </button>

              <span className="text-[16px] font-semibold text-slate-100 tracking-tight flex-1">
                CortexAI
              </span>

              <span
                className="
                  text-[10px]
                  font-medium
                  text-indigo-400
                  bg-indigo-500/10
                  border border-indigo-500/20
                  px-2 py-0.5
                  rounded-full
                  tracking-wide
                "
              >
                {userData?.plan || "free"}
              </span>

              <button
                className="
                  flex items-center justify-center
                  w-7 h-7
                  rounded-lg
                  text-slate-500
                  hover:text-slate-200
                  hover:bg-white/5
                  transition-colors
                  cursor-pointer
                "
                onClick={handleCreateConversation}
              >
                <PenSquare size={14} />
              </button>
            </div>

            {/* New Chat */}

            <div className="px-4 pt-4 pb-1">
              <button
                onClick={handleCreateConversation}
                className="
                  w-full
                  flex items-center justify-center gap-2
                  text-sm font-medium
                  text-white
                  bg-linear-to-br from-indigo-500 to-violet-700
                  rounded-xl
                  py-2.5
                  cursor-pointer
                  hover:opacity-90
                  transition-opacity
                "
              >
                <Plus size={15} />
                New Chat
              </button>
            </div>

            {/* Recents */}

            <div
              className="
                px-5 pt-4 pb-1.5
                text-[10.5px]
                font-semibold
                uppercase
                tracking-widest
                text-slate-600
              "
            >
              {conversations.length === 0
                ? "No recent conversations"
                : "Recents"}
            </div>

            <ConversationList />

            {/* Divider */}

            <div className="mx-2.5 h-px bg-white/6" />

            {/* Footer */}

            <div className="px-3.5 py-3.5">
              {userData ? (
                <div
                  className="
                    flex items-center gap-2.5
                    rounded-xl
                    px-3 py-2.5
                    hover:bg-white/5
                    transition-colors
                  "
                >
                  <div className="relative shrink-0">
                    <UserAvatar />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-slate-100 truncate">
                      {userData?.name || "User"}
                    </p>

                    <p className="text-[11px] text-slate-600 mt-1">
                      {userData?.plan || "free"}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    {/* Billing */}

                    <button
                      className="
                        flex items-center justify-center
                        w-7 h-7
                        rounded-[7px]
                        bg-transparent
                        text-yellow-600
                        cursor-pointer
                        hover:bg-white/8
                        hover:text-yellow-400
                        transition-all
                      "
                      onClick={() => setShowBilling(true)}
                    >
                      <Coins size={16} />
                    </button>

                    {/* Logout */}

                    <button
                      className="
                        flex items-center justify-center
                        w-7 h-7
                        rounded-[7px]
                        bg-transparent
                        text-slate-600
                        cursor-pointer
                        hover:bg-white/8
                        hover:text-slate-400
                        transition-all
                      "
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="
                    w-full
                    flex items-center justify-center gap-2
                    text-sm font-medium
                    text-slate-200
                    bg-white/5
                    border border-white/8
                    rounded-xl
                    py-2.5
                    cursor-pointer
                    hover:bg-white/8
                    transition-colors
                  "
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          BILLING DRAWER
          IMPORTANT: OUTSIDE SIDEBAR
      ====================================================== */}

      <BillingDrawer
        open={showBilling}
        onClose={() => setShowBilling(false)}
      />
    </>
  );
};

export default Sidebar;
