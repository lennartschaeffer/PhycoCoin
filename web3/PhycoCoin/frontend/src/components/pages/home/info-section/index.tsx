import styles from "./styles.module.css";

export default function InfoSection() {
  return (
    <div className={styles.infoSection}>
      <div className={styles.infoSectionInner}>
        <h2 className={styles.heading}>About PhycoCoin</h2>

        <hr className={styles.divider} />

        <div className={styles.mainInfo}>
          <p className={styles.text}>
            PhycoCoin is a specialized cryptocurrency designed for seaweed
            farmers, based on Nutrient Trading Credits (NTC). This platform
            allows seaweed farmers to convert their environmental benefits into
            tradable digital assets.
          </p>
        </div>

        <h3 className={styles.subheading}>How It Works</h3>

        <ul className={styles.list}>
          <li className={styles.listItem}>
            <h4 className={styles.featureHeading}>Seaweed Cultivation</h4>
            <p className={styles.text}>
              Farmers grow seaweed that naturally absorbs nitrogen, phosphorus,
              and carbon dioxide from ocean waters.
            </p>
          </li>

          <li className={styles.listItem}>
            <h4 className={styles.featureHeading}>Nutrient Measurement</h4>
            <p className={styles.text}>
              The nutrients removed are measured and verified through our
              monitoring system.
            </p>
          </li>

          <li className={styles.listItem}>
            <h4 className={styles.featureHeading}>NTC Conversion</h4>
            <p className={styles.text}>
              Verified nutrient removal is converted into PhycoCoins at a
              standardized rate.
            </p>
          </li>

          <li className={styles.listItem}>
            <h4 className={styles.featureHeading}>Send & Trade</h4>
            <p className={styles.text}>
              Use this platform to send PhycoCoins to other users or exchange
              them in our marketplace.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
