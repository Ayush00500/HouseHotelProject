// StripePayment.js

import React from 'react';
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axiosInstance from '@/utils/axios';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import { DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
const pk = import.meta.env.VITE_STRIPE_SECRET_KEY;

const stripePromise = loadStripe(pk);

const PaymentGateway = ({
  numberOfNights,
  noOfGuests,
  place,
  phone,
  name,
  dateRange,
  id,
  price,
}) => {
  const options = {
    // passing the client secret obtained from the server
    clientSecret:
      'sk_test_51MijVLSDtAn3YG6VyiO4NfvqEjxzvBdjYI3R1QRYnxPAcpcmCt3ldVJsnjUkugJzF30lst6KR9PS7V6cTVDkQPHF00EuKVtfKf',
  };

  const handlePaymentSuccess = async () => {
    try {
      if (!user) {
        return setRedirect(`/login`);
      }

      // BOOKING DATA VALIDATION
      if (numberOfNights < 1) {
        return toast.error('Please select valid dates');
      } else if (noOfGuests < 1) {
        return toast.error("No. of guests can't be less than 1");
      } else if (noOfGuests > place.maxGuests) {
        return toast.error(`Allowed max. no. of guests: ${place.maxGuests}`);
      } else if (name.trim() === '') {
        return toast.error("Name can't be empty");
      } else if (phone.trim() === '') {
        return toast.error("Phone can't be empty");
      }

      const response = await axiosInstance.post('/bookings', {
        checkIn: dateRange.from,
        checkOut: dateRange.to,
        noOfGuests: noOfGuests,
        name: name,
        phone: phone,
        place: id,
        price: numberOfNights * price,
      });

      const bookingId = response.data.booking._id;

      setRedirect(`/account/bookings/${bookingId}`);
      toast('Congratulations! Enjoy your trip.');
    } catch (error) {
      toast.error('Something went wrong!');
      console.log('Error: ', error);
    }
    // Handle successful payment (e.g., update UI, redirect, etc.)
    // You can use react-router-dom to navigate:
    // history.push('/success');
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    // Show an error message to the user
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="primary mt-4">
            Book this place
            {numberOfNights > 0 && (
              <span> ₹{numberOfNights * place.price}</span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex justify-center">
            <div className="relative h-40 w-40 cursor-pointer overflow-hidden rounded-full bg-gray-200">
              <div className="absolute flex h-full w-full items-center justify-center bg-gray-200 hover:z-10">
                <input type="file" className="hidden" />
                {/* <Upload height={50} width={50} color="#4e4646" /> */}
              </div>

              {/* {picture ? (
                <Avatar className="transition-all ease-in-out hover:z-0 hover:hidden ">
                  <AvatarImage src="" />
                </Avatar>
              ) : (
                <Avatar className="transition-all ease-in-out hover:z-0 hover:hidden ">
                  <AvatarImage src="" />
                </Avatar>
              )} */}
            </div>
          </div>

          {/* Update form */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Elements stripe={stripePromise} options={options}>
                {/* Your payment form or Stripe Elements go here */}
                {/* For example, use PaymentElement */}
                <PaymentElement />
                {/* Add your form fields for name and amount */}
                <input type="text" placeholder="Name" />
                <input type="number" placeholder="Amount" />
                {/* Add a submit button */}
                <button>Pay Now</button>
              </Elements>
              {/* <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={userData.name}
                className="col-span-3"
                onChange={handleUserData}
              /> */}
            </div>
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                New Password
              </Label>
              <Input
                id="password"
                name="password"
                value={userData.password}
                className="col-span-3"
                type="password"
                onChange={handleUserData}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirm_Password" className="text-right">
                Confirm Password
              </Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                value={userData.confirm_password}
                className="col-span-3"
                type="password"
                onChange={handleUserData}
              />
            </div> */}
          </div>
          {/* <DialogFooter>
            <Button
              disabled={loading}
              type="submit"
              className="w-full"
              onClick={handleSaveChanges}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentGateway;
