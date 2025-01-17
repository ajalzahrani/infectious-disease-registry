import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/date-range-picker";

export function NotificationFilters() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="search">Search</Label>
        <Input id="search" placeholder="Search notifications" />
      </div>
      <div>
        <Label htmlFor="type">Notification Type</Label>
        <Select>
          <SelectTrigger id="type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="alert">Alert</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Date Range</Label>
        <DatePickerWithRange />
      </div>
      <Button className="w-full">Apply Filters</Button>
    </div>
  );
}
