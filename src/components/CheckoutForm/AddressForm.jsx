import React, { useState, useEffect } from 'react';
import {
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
} from '@material-ui/core';
import {Link} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { commerce } from '../../lib/commerce';
import FormInput from './CustomTextFields';
const AddressForm = ({ checkoutToken , next}) => {
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState('');
  const countries = Object.entries(shippingCountries).map(([code, name]) => ({
    id: code,
    label: name,
  }));
  const subdivisions = Object.entries(shippingSubdivisions).map(
    ([code, name]) => ({
      id: code,
      label: name,
    })
  );
  const options = shippingOptions.map((shipOp) => ({
    id: shipOp.id,
    label: `${shipOp.description} - (${shipOp.price.formatted_with_symbol})`,
  }));
  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(
      checkoutTokenId
    );
    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
  };
  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(
      countryCode
    );
    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (
    checkoutTokenId,
    country,
    region = null
  ) => {
    const options = await commerce.checkout.getShippingOptions(
      checkoutTokenId,
      { country, region }
    );
    setShippingOptions(options);
    setShippingOption(options[0].id);
  };
  useEffect(() => {
    fetchShippingCountries(checkoutToken.id);
  }, []);
  useEffect(() => {
    if (shippingCountry) fetchSubdivisions(shippingCountry);
  }, [shippingCountry]);
  useEffect(() => {
    if (shippingSubdivision)
      fetchShippingOptions(
        checkoutToken.id,
        shippingCountry,
        shippingSubdivision
      );
  }, [shippingSubdivision]);
  const { handleSubmit } = useForm();
  return (
    <>
      <Typography variant='h6' gutterBottom>
        Shipping Address
      </Typography>

      <form onSubmit={handleSubmit((data)=> next({...data, shippingCountry, shippingSubdivision, shippingOption}))}>
        <Grid container spacing={3}>
          <FormInput
            {...{
              name: 'firstName',
              label: 'First Name',
              required: true,
            }}
          />
          <FormInput
            {...{
              name: 'lastName',
              label: 'Last Name',
              required: true,
            }}
          />
          <FormInput
            {...{
              name: 'address1',
              label: 'Address',
              required: true,
            }}
          />
          <FormInput
            {...{
              name: 'email',
              label: 'Email',
              required: true,
            }}
          />
          <FormInput
            {...{
              name: 'city',
              label: 'City',
              required: true,
            }}
          />
          <FormInput
            {...{
              name: 'zip',
              label: 'ZIP Code',
              required: true,
            }}
          />
          <Grid item xs={12} sm={6}>
            <InputLabel>Shipping Country</InputLabel>
            <Select
              value={shippingCountry}
              fullWidth
              onChange={(e) => setShippingCountry(e.target.value)}
            >
              {countries.map((country) => (
                <MenuItem key={country.id} value={country.id}>
                  {country.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Shipping Subdivision</InputLabel>
            <Select
              value={shippingSubdivision}
              fullWidth
              onChange={(e) => setShippingSubdivision(e.target.value)}
            >
              {subdivisions.map((subdivision) => (
                <MenuItem key={subdivision.id} value={subdivision.id}>
                  {subdivision.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Shipping Options</InputLabel>
            <Select
              value={shippingOption}
              fullWidth
              onChange={(e) => setShippingOption(e.target.value)}
            >
              {options.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
        <br />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant='outlined' component={Link} to='/cart'>
            Back to Cart
          </Button>
          <Button type='submit' variant='contained' color='primary'>
            Next
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddressForm;
