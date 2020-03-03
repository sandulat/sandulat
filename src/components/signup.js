import React from 'react';

const Field = ({ type, name, placeholder }) => (
  <div className="mb-4">
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required="required"
      className="w-full p-3 rounded text-dark-purple-900 placeholder-dark-purple-400"
    />
  </div>
);

const SignupForm = () => (
  <form
    action="https://sandulat.us7.list-manage.com/subscribe/post?u=697fc5967b213b16e703dbdf9&amp;id=5a5bb04b0e"
    method="post"
    target="_blank"
    noValidate
  >
    <Field type="text" name="FIRSTNAME" placeholder="Your first name" />
    <Field type="text" name="EMAIL" placeholder="Your email address" />
    <div style={{ left: '-5000px' }} className="absolute" aria-hidden="true">
      <input
        type="text"
        name="b_697fc5967b213b16e703dbdf9_5a5bb04b0e"
        tabIndex="-1"
      />
    </div>
    <div className="mb-2">
      <button
        type="submit"
        name="subscribe"
        className="w-full p-3 text-sm font-medium tracking-wide text-white transition-colors duration-300 bg-indigo-600 rounded hover:bg-indigo-700"
      >
        Subscribe
      </button>
    </div>
    <div>
      <span className="text-xs text-dark-purple-400">
        I respect your privacy. Unsubscribe at any time.
      </span>
    </div>
  </form>
);

const Signup = () => (
  <div className="flex flex-col rounded shadow-lg md:flex-row">
    <div className="w-full p-8 text-white rounded-l bg-dark-purple-800 md:p-10 md:w-1/2">
      <h3 className="mb-6 font-medium text-white">Join the Newsletter</h3>
      <p className="text-sm tracking-wide text-dark-purple-400">
        Subscribe to get my latest posts by email.
      </p>
    </div>
    <div className="w-full p-8 rounded-r md:w-1/2 bg-dark-purple-700 md:p-10">
      <SignupForm />
    </div>
  </div>
);

export default Signup;
