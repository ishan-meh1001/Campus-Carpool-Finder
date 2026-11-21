import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, ShieldCheck, Users, Clock, ArrowRight, MapPin, DollarSign } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-gray-50 pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <span>Exclusive College Community</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Smart, Affordable & Safe <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Campus Carpooling
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
            Connect with verified college peers heading your way. Share travel costs, cut commute times, and build campus connections with trust and ease.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 bg-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 bg-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
                >
                  <span>Get Started with College ID</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 bg-white text-gray-700 font-medium border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Students Choose Campus Carpool</h2>
          <p className="text-gray-500 mt-2">Tailored specifically for campus schedules and safety.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Students Only</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every driver and rider is verified with college credentials. Travel with peace of mind knowing you are sharing rides with fellow students.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Split Commute Costs</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Save significantly on daily auto and cab fares. Fair and transparent per-seat cost sharing agreed upon in advance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Seamless Scheduling</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Coordinate rides matching college lecture timings, exam periods, and weekend homecoming trips with intuitive instant requests.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50 rounded-3xl p-8 sm:p-12 border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10">
          How It Works in 3 Easy Steps
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto shadow-md shadow-indigo-200">
              1
            </div>
            <h4 className="font-semibold text-gray-900">Sign Up & Verify</h4>
            <p className="text-xs text-gray-500">
              Create your account with your student details to join the campus pool.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto shadow-md shadow-indigo-200">
              2
            </div>
            <h4 className="font-semibold text-gray-900">Search or Post</h4>
            <p className="text-xs text-gray-500">
              Post empty seats in your car or search for rides leaving around your classes.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto shadow-md shadow-indigo-200">
              3
            </div>
            <h4 className="font-semibold text-gray-900">Travel & Rate</h4>
            <p className="text-xs text-gray-500">
              Driver accepts your request, you travel safely, and rate each other to maintain community trust.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
