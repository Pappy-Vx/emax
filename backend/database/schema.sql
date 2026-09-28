-- ─────────────────────────────────────────────────────────────────────────────
-- eMax Errands & More — MySQL 8.x Schema
-- Run this in Railway's query editor (or any MySQL 8.x client)
-- Table order matters: users must exist before errands and addresses (FK deps)
-- ─────────────────────────────────────────────────────────────────────────────

-- Use the database Railway gives you (usually named "railway")
-- If your DB_NAME is different, change the line below
USE `railway`;

-- ── Users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id`            VARCHAR(36)   NOT NULL,
  `name`          VARCHAR(255)  NOT NULL,
  `email`         VARCHAR(255)  NOT NULL,
  `passwordHash`  VARCHAR(255)      NULL,          -- NULL for Google-only accounts
  `phone`         VARCHAR(255)      NULL,
  `role`          VARCHAR(20)   NOT NULL DEFAULT 'customer',
  `planId`        VARCHAR(50)       NULL,          -- individual | family | business
  `referralCode`  VARCHAR(20)       NULL,
  `referredBy`    VARCHAR(20)       NULL,
  `hivePoints`    INT           NOT NULL DEFAULT 0,
  `isVerified`    TINYINT(1)    NOT NULL DEFAULT 0,
  `twoFaEnabled`  TINYINT(1)    NOT NULL DEFAULT 0,
  `otpHash`       VARCHAR(64)       NULL,          -- SHA-256 hex of current OTP
  `otpExpiresAt`  DATETIME(6)       NULL,
  `googleId`      VARCHAR(255)      NULL,
  `isGoogleAuth`  TINYINT(1)    NOT NULL DEFAULT 0,
  `createdAt`     DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt`     DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                                ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE  KEY `UQ_users_email`    (`email`),
  UNIQUE  KEY `UQ_users_googleId` (`googleId`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ── Errands ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `errands` (
  `id`                 VARCHAR(36)   NOT NULL,
  `userId`             VARCHAR(36)   NOT NULL,
  `type`               VARCHAR(255)  NOT NULL,
  `fromAddress`        VARCHAR(255)  NOT NULL,
  `toAddress`          VARCHAR(255)  NOT NULL,
  `scheduledAt`        DATETIME(6)   NOT NULL,
  `status`             VARCHAR(20)   NOT NULL DEFAULT 'scheduled',
                                     -- scheduled | confirmed | picked-up | on-the-way | completed | cancelled
  `runnerName`         VARCHAR(255)      NULL,
  `notes`              TEXT              NULL,
  `isRecurring`        TINYINT(1)    NOT NULL DEFAULT 0,
  `recurringFrequency` VARCHAR(50)       NULL,     -- 'Every week' | 'Every 2 weeks' | 'Every month'
  `pointsAwarded`      INT           NOT NULL DEFAULT 20,
  `createdAt`          DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt`          DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                                     ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_errands_userId`   (`userId`),
  KEY `IDX_errands_status`   (`status`),
  CONSTRAINT `FK_errands_users`
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ── Addresses ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `addresses` (
  `id`        VARCHAR(36)   NOT NULL,
  `userId`    VARCHAR(36)   NOT NULL,
  `label`     VARCHAR(50)   NOT NULL,             -- e.g. "Home", "Office"
  `line`      VARCHAR(255)  NOT NULL,             -- full street address
  `city`      VARCHAR(80)       NULL,
  `state`     VARCHAR(50)       NULL,
  `zip`       VARCHAR(10)       NULL,
  `note`      TEXT              NULL,             -- delivery instructions
  `isPrimary` TINYINT(1)    NOT NULL DEFAULT 0,
  `createdAt` DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                             ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_addresses_userId` (`userId`),
  CONSTRAINT `FK_addresses_users`
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ── Payments ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `payments` (
  `id`            VARCHAR(36)   NOT NULL,
  `userId`        VARCHAR(36)   NOT NULL,
  `userName`      VARCHAR(255)  NOT NULL,          -- snapshot at time of payment
  `planId`        VARCHAR(20)   NOT NULL,           -- individual | family | business
  `paymentMethod` VARCHAR(20)   NOT NULL,           -- card | google_pay | apple_pay
  `amountCents`   INT           NOT NULL,           -- e.g. 4900 = $49.00
  `chargeId`      VARCHAR(255)  NOT NULL,           -- Stripe charge / payment-intent ID
  `status`        ENUM('pending','processing','succeeded','failed','cancelled','refunded')
                                NOT NULL DEFAULT 'pending',
  `createdAt`     DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt`     DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                                ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_payments_userId` (`userId`),
  KEY `IDX_payments_status` (`status`),
  CONSTRAINT `FK_payments_users`
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ── Notifications ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `notifications` (
  `id`             VARCHAR(36)   NOT NULL,
  `userId`         VARCHAR(36)   NOT NULL,
  `recipientEmail` VARCHAR(255)  NOT NULL,
  `type`           ENUM(
                     'welcome','login_success','otp_sent',
                     'payment_succeeded','payment_failed','payment_refunded',
                     'plan_activated','plan_changed',
                     'errand_created','errand_confirmed','errand_picked_up',
                     'errand_completed','errand_cancelled',
                     'system'
                   ) NOT NULL,
  `channel`        ENUM('email','push','sms') NOT NULL DEFAULT 'email',
  `status`         ENUM('pending','sent','failed') NOT NULL DEFAULT 'pending',
  `title`          VARCHAR(255)  NOT NULL,
  `body`           TEXT          NOT NULL,
  `metadata`       TEXT              NULL,            -- JSON string: plan, errand id, charge id…
  `sentAt`         DATETIME(6)       NULL,
  `failureReason`  VARCHAR(255)      NULL,
  `readAt`         DATETIME(6)       NULL,            -- set when user acknowledges in UI
  `createdAt`      DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt`      DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                                 ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_notifications_userId`    (`userId`),
  KEY `IDX_notifications_status`    (`status`),
  KEY `IDX_notifications_createdAt` (`createdAt`),   -- speeds up the 30-day query
  CONSTRAINT `FK_notifications_users`
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- Verify tables were created
-- ─────────────────────────────────────────────────────────────────────────────
SHOW TABLES;
