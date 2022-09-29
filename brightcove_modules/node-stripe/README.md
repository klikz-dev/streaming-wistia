# node-stripe

This is a wrapper around Stripe to make SVOD easier.

## Usage

```js
var stripe = require('node-stripe');
stripe.init('SECRET_KEY', {
  // options
});

// Retrieve all plans
stripe.getAllPlans().then(function(plans) {
  // plans is an array of stripe.models.Plan models
});

// The underlying Stripe library is accessible under the `lib` property:
stripe.lib.plan.list().then(function(plans) {
});
```

TODO: document this more.

## Notes

# Subscriptions are based on tags
# This lib expects each plan to have the following metadata fields:
`subscriber_count`, `tags`, `type[svod|tvod]`
# Each customer is created with a `foreignKey` metadata field
# Both SVOD and TVOD are achieved by subscribing users to plans. If a plan is of
type=tvod, it must also have a $0 currency with one-time amount in a custom
metadata field titled `tvod_amount`. The user will be subscribed to the plan and
a charge will created with the amount in the `tvod_amount` metadata field.

This is somewhat hacky but Stripe doesn't support the notion of one-time payments
to a plan. That said, there are three advantages to this setup: 1) Stripe remains
the source of truth for packages and entitlements, 2) entitlements can be revoked
by cancelling the subscription, and 3) the code to support both SVOD and TVOD are 99% the same.

## TODO

* Support coupon codes for TVOD plans. The charge amount needs to be calculated manually.


## Tests

There are some basic tests in the `test/` directory, broken down by modules. You can use the command `npm test` to run them all. Alternatively, you can add any tests you don't want to run to the `test/other/` directory and it will be ignored.
