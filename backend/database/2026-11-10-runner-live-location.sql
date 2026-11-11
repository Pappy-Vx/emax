-- Runner live location (track order). Run once in phpMyAdmin > SQL on the production database.
ALTER TABLE `errands`
  ADD COLUMN `runnerLat` double NULL,
  ADD COLUMN `runnerLng` double NULL,
  ADD COLUMN `runnerAccuracy` int NULL,
  ADD COLUMN `runnerLocationAt` datetime NULL;
