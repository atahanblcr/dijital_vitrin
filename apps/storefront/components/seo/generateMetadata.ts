import { Metadata } from 'next';

type BaseSeoProps = {
  title: string;
  description: string;
  image?: string;
  url: string;
  businessName: string;
  type?: 'website' | 'article' | 'profile';
};

export function generateBaseMetadata({
  title,
  description,
  image,
  url,
  businessName,
  type = 'website',
}: BaseSeoProps): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: businessName,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
      locale: 'tr_TR',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}
