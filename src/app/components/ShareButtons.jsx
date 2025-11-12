"use client";

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  RedditShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
  RedditIcon,
} from "next-share";

export default function ShareButtons({ url, title }) {
  return (
    <div className="mb-4 py-6 border-t border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Share this article
      </h3>
      <div className="flex flex-wrap gap-3">
        <FacebookShareButton url={url} quote={title}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>

        <TwitterShareButton url={url} title={title}>
          <TwitterIcon size={40} round />
        </TwitterShareButton>

        <LinkedinShareButton url={url} title={title}>
          <LinkedinIcon size={40} round />
        </LinkedinShareButton>

        <WhatsappShareButton url={url} title={title}>
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>

        <TelegramShareButton url={url} title={title}>
          <TelegramIcon size={40} round />
        </TelegramShareButton>

        <RedditShareButton url={url} title={title}>
          <RedditIcon size={40} round />
        </RedditShareButton>
      </div>
    </div>
  );
}
